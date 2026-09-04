import pytest


def test_researcher_crud_happy_path(client, auth_headers):
    # 1. Create a researcher
    create_resp = client.post(
        "/researchers/",
        headers=auth_headers,
        json={
            "full_name": "John Doe",
            "email": "johndoe@example.com",
            "department": "Computer Science",
            "institution": "Tech University",
            "designation": "Professor"
        }
    )
    assert create_resp.status_code == 200
    data = create_resp.json()
    assert data["full_name"] == "John Doe"
    researcher_id = data["id"]
    
    # 2. Get all researchers
    get_all_resp = client.get("/researchers/", headers=auth_headers)
    assert get_all_resp.status_code == 200
    assert len(get_all_resp.json()) >= 1
    
    # 3. Get one researcher
    get_one_resp = client.get(f"/researchers/{researcher_id}", headers=auth_headers)
    assert get_one_resp.status_code == 200
    assert get_one_resp.json()["id"] == researcher_id
    
    # 4. Update researcher
    update_resp = client.put(
        f"/researchers/{researcher_id}",
        headers=auth_headers,
        json={
            "designation": "Senior Professor"
        }
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["designation"] == "Senior Professor"
    
    # 5. Delete researcher
    delete_resp = client.delete(f"/researchers/{researcher_id}", headers=auth_headers)
    assert delete_resp.status_code == 200
    
    # Verify it is deleted (soft delete)
    get_deleted = client.get(f"/researchers/{researcher_id}", headers=auth_headers)
    assert get_deleted.status_code == 404


def test_researcher_rbac_reviewer_denied(client, reviewer_headers, auth_headers):
    # Create researcher with a normal researcher auth
    create_resp = client.post(
        "/researchers/",
        headers=auth_headers,
        json={
            "full_name": "Jane Doe",
            "email": "janedoe@example.com",
            "department": "Biology",
            "institution": "Bio University",
            "designation": "Researcher"
        }
    )
    researcher_id = create_resp.json()["id"]
    
    # Try to edit it using reviewer_headers (Reviewer role)
    update_resp = client.put(
        f"/researchers/{researcher_id}",
        headers=reviewer_headers,
        json={"department": "Chemistry"}
    )
    assert update_resp.status_code == 403
    assert "permission" in update_resp.json()["detail"].lower()


def test_researcher_rbac_inst_admin_denied_other_inst(client, inst_admin_headers, auth_headers):
    # Create researcher in "Bio University"
    create_resp = client.post(
        "/researchers/",
        headers=auth_headers,
        json={
            "full_name": "Bob Smith",
            "email": "bobsmith@example.com",
            "department": "Physics",
            "institution": "Bio University",
            "designation": "Lecturer"
        }
    )
    researcher_id = create_resp.json()["id"]
    
    # Inst Admin profile creation
    client.post(
        "/researchers/",
        headers=inst_admin_headers,
        json={
            "full_name": "Admin Smith",
            "email": "admin@test.com",
            "department": "Admin Dept",
            "institution": "Different University",
            "designation": "Admin"
        }
    )
    
    # Inst Admin tries to edit researcher from Bio University
    update_resp = client.put(
        f"/researchers/{researcher_id}",
        headers=inst_admin_headers,
        json={"designation": "Senior Lecturer"}
    )
    assert update_resp.status_code == 403


def test_researcher_rbac_inst_admin_allowed_own_inst(client, inst_admin_headers, auth_headers):
    # Create researcher in "Same University"
    create_resp = client.post(
        "/researchers/",
        headers=auth_headers,
        json={
            "full_name": "Alice Green",
            "email": "alice@example.com",
            "department": "Math",
            "institution": "Same University",
            "designation": "Assistant"
        }
    )
    researcher_id = create_resp.json()["id"]
    
    # Inst Admin profile creation
    client.post(
        "/researchers/",
        headers=inst_admin_headers,
        json={
            "full_name": "Admin Green",
            "email": "admin2@same.com",
            "department": "Admin Dept",
            "institution": "Same University",
            "designation": "Admin"
        }
    )
    
    # Inst Admin tries to edit researcher from Same University
    update_resp = client.put(
        f"/researchers/{researcher_id}",
        headers=inst_admin_headers,
        json={"designation": "Associate Professor"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["designation"] == "Associate Professor"


def test_researcher_cannot_edit_another_researcher(client, auth_headers, admin_headers):
    # Create researcher 1 using admin_headers just to bypass auth_headers user_id link
    create_resp = client.post(
        "/researchers/",
        headers=admin_headers,
        json={
            "full_name": "Chris White",
            "email": "chris@example.com",
            "department": "Arts",
            "institution": "Art College",
            "designation": "Tutor"
        }
    )
    researcher_id = create_resp.json()["id"]
    
    # Researcher 2 (auth_headers) tries to edit Researcher 1
    update_resp = client.put(
        f"/researchers/{researcher_id}",
        headers=auth_headers,
        json={"designation": "Senior Tutor"}
    )
    assert update_resp.status_code == 403
