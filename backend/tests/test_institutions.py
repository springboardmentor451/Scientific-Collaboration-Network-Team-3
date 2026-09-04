import pytest


def test_institution_crud_happy_path(client, admin_headers, auth_headers):
    # Admin creates institution
    create_resp = client.post(
        "/institutions/",
        headers=admin_headers,
        json={
            "name": "MIT",
            "city": "Cambridge",
            "state": "MA",
            "country": "USA"
        }
    )
    assert create_resp.status_code == 200
    inst_id = create_resp.json()["id"]

    # Anyone can get all
    get_all = client.get("/institutions/", headers=auth_headers)
    assert get_all.status_code == 200
    assert len(get_all.json()) >= 1

    # Admin updates institution
    update_resp = client.put(
        f"/institutions/{inst_id}",
        headers=admin_headers,
        json={"name": "MIT Updated"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["name"] == "MIT Updated"

    # Researcher cannot delete institution
    delete_deny = client.delete(f"/institutions/{inst_id}", headers=auth_headers)
    assert delete_deny.status_code == 403

    # Admin deletes institution
    delete_resp = client.delete(f"/institutions/{inst_id}", headers=admin_headers)
    assert delete_resp.status_code == 200
