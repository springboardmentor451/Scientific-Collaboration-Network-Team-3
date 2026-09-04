import pytest


def test_citation_crud_happy_path(client, auth_headers):
    # Researcher creates citation
    create_resp = client.post(
        "/citations/",
        headers=auth_headers,
        json={
            "title": "A Great Paper",
            "authors": "Alice, Bob",
            "year": 2026,
            "journal": "Journal of AI",
            "doi": "10.1234/5678"
        }
    )
    assert create_resp.status_code == 200
    cit_id = create_resp.json()["id"]

    # Anyone can get all
    get_all = client.get("/citations/", headers=auth_headers)
    assert get_all.status_code == 200
    assert len(get_all.json()) >= 1

    # Update citation
    update_resp = client.put(
        f"/citations/{cit_id}",
        headers=auth_headers,
        json={"title": "An Even Greater Paper"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "An Even Greater Paper"

    # Delete citation
    delete_resp = client.delete(f"/citations/{cit_id}", headers=auth_headers)
    assert delete_resp.status_code == 200


def test_citation_invalid_doi(client, auth_headers):
    # Researcher creates citation with invalid DOI
    create_resp = client.post(
        "/citations/",
        headers=auth_headers,
        json={
            "title": "A Bad Paper",
            "authors": "Eve",
            "year": 2026,
            "journal": "Predatory Journal",
            "doi": "invalid_doi_format"
        }
    )
    assert create_resp.status_code == 422


def test_citation_rbac_reviewer_denied(client, reviewer_headers):
    # Reviewer attempts to create citation
    create_resp = client.post(
        "/citations/",
        headers=reviewer_headers,
        json={
            "title": "My Review",
            "authors": "Reviewer 2",
            "year": 2026,
            "journal": "N/A"
        }
    )
    assert create_resp.status_code == 403
