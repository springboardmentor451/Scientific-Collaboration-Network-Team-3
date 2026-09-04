import pytest

def test_dashboard_stats(client, auth_headers):
    # Test that any authenticated user can get stats
    resp = client.get("/dashboard/stats", headers=auth_headers)
    assert resp.status_code == 200
    
    data = resp.json()
    assert "total_researchers" in data
    assert "total_publications" in data
    assert "total_collaborations" in data
    assert "total_citations" in data
    assert "total_institutions" in data
    assert "total_conferences" in data

    # Ensure types are int
    assert isinstance(data["total_researchers"], int)
