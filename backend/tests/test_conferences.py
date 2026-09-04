import pytest


def test_conference_crud_happy_path(client, admin_headers, auth_headers):
    # Admin creates conference
    create_resp = client.post(
        "/conferences/",
        headers=admin_headers,
        json={
            "name": "International Conference on Quantum Computing",
            "acronym": "ICQC",
            "year": 2026,
            "location": "Boston, MA",
            "organizer": "IEEE"
        }
    )
    assert create_resp.status_code == 200
    conf_id = create_resp.json()["id"]

    # Anyone can get all
    get_all = client.get("/conferences/", headers=auth_headers)
    assert get_all.status_code == 200
    assert len(get_all.json()) >= 1

    # Admin updates conference
    update_resp = client.put(
        f"/conferences/{conf_id}",
        headers=admin_headers,
        json={"location": "Virtual"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["location"] == "Virtual"

    # Researcher cannot delete conference
    delete_deny = client.delete(f"/conferences/{conf_id}", headers=auth_headers)
    assert delete_deny.status_code == 403

    # Admin deletes conference
    delete_resp = client.delete(f"/conferences/{conf_id}", headers=admin_headers)
    assert delete_resp.status_code == 200
