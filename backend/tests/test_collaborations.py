import pytest


@pytest.fixture
def test_researchers(client, admin_headers):
    # Create two researchers
    r1 = client.post(
        "/researchers/",
        headers=admin_headers,
        json={
            "full_name": "Alice",
            "email": "alice@collab.com",
            "department": "CS",
            "institution": "Univ A",
            "designation": "Prof"
        }
    ).json()

    r2 = client.post(
        "/researchers/",
        headers=admin_headers,
        json={
            "full_name": "Bob",
            "email": "bob@collab.com",
            "department": "CS",
            "institution": "Univ B",
            "designation": "Prof"
        }
    ).json()
    return r1["id"], r2["id"]


def test_collaboration_crud_and_network(client, admin_headers, auth_headers, test_researchers):
    r1_id, r2_id = test_researchers

    # Admin creates collaboration
    create_resp = client.post(
        "/collaborations/",
        headers=admin_headers,
        json={
            "researcher1_id": r1_id,
            "researcher2_id": r2_id,
            "collaboration_strength": 5.0
        }
    )
    assert create_resp.status_code == 200
    collab_id = create_resp.json()["id"]

    # Anyone can view network
    network_resp = client.get("/collaborations/network", headers=auth_headers)
    assert network_resp.status_code == 200
    net_data = network_resp.json()
    assert "nodes" in net_data
    assert "edges" in net_data
    
    # We should have at least 2 nodes and 1 edge
    assert len(net_data["nodes"]) >= 2
    assert len(net_data["edges"]) >= 1

    # Verify edge data
    edge = next((e for e in net_data["edges"] if e["source"] == str(r1_id) and e["target"] == str(r2_id)), None)
    assert edge is not None
    assert edge["weight"] == 5.0

    # Normal user cannot update
    update_deny = client.put(
        f"/collaborations/{collab_id}",
        headers=auth_headers,
        json={"collaboration_strength": 10.0}
    )
    assert update_deny.status_code == 403

    # Admin updates
    update_resp = client.put(
        f"/collaborations/{collab_id}",
        headers=admin_headers,
        json={"collaboration_strength": 10.0}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["collaboration_strength"] == 10.0

    # Admin deletes
    delete_resp = client.delete(f"/collaborations/{collab_id}", headers=admin_headers)
    assert delete_resp.status_code == 200
