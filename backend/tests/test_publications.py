import pytest


@pytest.fixture
def test_researcher_id(client, auth_headers):
    # Create a researcher for the default researcher user
    resp = client.post(
        "/researchers/",
        headers=auth_headers,
        json={
            "full_name": "Test Researcher",
            "email": "testres@example.com",
            "department": "CS",
            "institution": "Test Univ",
            "designation": "Prof"
        }
    )
    return resp.json()["id"]


def test_publication_crud_happy_path(client, auth_headers, test_researcher_id):
    # Create Publication
    create_resp = client.post(
        "/publications/",
        headers=auth_headers,
        json={
            "title": "Quantum Computing",
            "authors": "Test Researcher",
            "publication_type": "Journal",
            "year": 2026,
            "doi": "10.1000/182",
            "status": "Published",
            "author_links": [
                {
                    "researcher_id": test_researcher_id,
                    "author_role": "first_author"
                }
            ]
        }
    )
    assert create_resp.status_code == 200
    pub_id = create_resp.json()["id"]
    
    # Get all
    get_all_resp = client.get("/publications/", headers=auth_headers)
    assert get_all_resp.status_code == 200
    assert len(get_all_resp.json()) >= 1
    
    # Update
    update_resp = client.put(
        f"/publications/{pub_id}",
        headers=auth_headers,
        json={
            "status": "Draft",
            "author_links": [
                {
                    "researcher_id": test_researcher_id,
                    "author_role": "co_author"
                }
            ]
        }
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "Draft"
    assert update_resp.json()["author_links"][0]["author_role"] == "co_author"
    
    # Delete
    delete_resp = client.delete(f"/publications/{pub_id}", headers=auth_headers)
    assert delete_resp.status_code == 200
    
    # Verify deleted
    get_deleted = client.get(f"/publications/{pub_id}", headers=auth_headers)
    assert get_deleted.status_code == 404


def test_publication_rbac_reviewer_denied(client, reviewer_headers):
    # Reviewer tries to create
    create_resp = client.post(
        "/publications/",
        headers=reviewer_headers,
        json={
            "title": "Bad Paper",
            "authors": "Reviewer",
            "publication_type": "Conference",
            "year": 2026,
            "doi": "10.1000/bad",
            "status": "Draft"
        }
    )
    assert create_resp.status_code == 403


def test_publication_rbac_researcher_cannot_edit_others(client, auth_headers, admin_headers, test_researcher_id):
    # Admin creates a publication with NO authors linked to `auth_headers` user
    create_resp = client.post(
        "/publications/",
        headers=admin_headers,
        json={
            "title": "Admin Paper",
            "authors": "Admin",
            "publication_type": "Journal",
            "year": 2026,
            "doi": "10.1000/admin",
            "status": "Published",
            "author_links": []
        }
    )
    pub_id = create_resp.json()["id"]
    
    # Normal researcher tries to edit it
    update_resp = client.put(
        f"/publications/{pub_id}",
        headers=auth_headers,
        json={"title": "Hacked Title"}
    )
    assert update_resp.status_code == 403


def test_publication_rbac_inst_admin_denied_other_inst(client, auth_headers, inst_admin_headers, test_researcher_id):
    # Normal researcher (Test Univ) creates publication
    create_resp = client.post(
        "/publications/",
        headers=auth_headers,
        json={
            "title": "Test Univ Paper",
            "authors": "Test Researcher",
            "publication_type": "Journal",
            "year": 2026,
            "doi": "10.1000/testuniv",
            "status": "Published",
            "author_links": [{"researcher_id": test_researcher_id, "author_role": "first_author"}]
        }
    )
    pub_id = create_resp.json()["id"]
    
    # Inst Admin creates their own profile in "Another Univ"
    client.post(
        "/researchers/",
        headers=inst_admin_headers,
        json={
            "full_name": "Admin",
            "email": "admin@another.com",
            "department": "Admin",
            "institution": "Another Univ",
            "designation": "Admin"
        }
    )
    
    # Inst Admin tries to edit "Test Univ Paper"
    update_resp = client.put(
        f"/publications/{pub_id}",
        headers=inst_admin_headers,
        json={"title": "Changed by Admin"}
    )
    assert update_resp.status_code == 403
