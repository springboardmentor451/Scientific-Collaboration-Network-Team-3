import React, { useMemo, useState } from 'react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import EmptyState from '../../components/common/EmptyState';

export default function TeamManagement() {
  const [members, setMembers] = useState([
    { id: 1, name: 'Dr. Aris Thorne', role: 'Principal Investigator', institution: 'Institute of Quantum Computing' },
    { id: 2, name: 'Dr. James Chen', role: 'Co-Investigator', institution: 'Global Research Network' },
  ]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ name: '', role: '', institution: '' });
  const [touched, setTouched] = useState({});

  const inviteErrors = useMemo(() => {
    const next = {};
    if (!invite.name.trim()) next.name = 'Name is required.';
    if (!invite.role.trim()) next.role = 'Role is required.';
    if (!invite.institution.trim()) next.institution = 'Institution is required.';
    return next;
  }, [invite]);

  const inviteValid = Object.keys(inviteErrors).length === 0;

  const columns = [
    { header: 'Member', render: (m) => <span className="font-semibold text-primary">{m.name}</span> },
    { header: 'Project Role', accessor: 'role' },
    { header: 'Institution', accessor: 'institution' },
    {
      header: 'Actions',
      render: (m) => (
        <Button variant="danger" icon="delete" onClick={() => setMembers((list) => list.filter((item) => item.id !== m.id))}>
          Remove
        </Button>
      ),
    },
  ];

  const submitInvite = (e) => {
    e.preventDefault();
    setTouched({ name: true, role: true, institution: true });
    if (!inviteValid) return;
    setMembers((list) => [...list, { id: Date.now(), ...invite }]);
    setInvite({ name: '', role: '', institution: '' });
    setTouched({});
    setInviteOpen(false);
  };

  return (
    <div className="w-full space-y-stack-md">
      <PageHeader
        title="Team Management"
        subtitle="Topological Data Analysis Project"
        actions={
          <Button icon="person_add" onClick={() => setInviteOpen(true)}>
            Invite Member
          </Button>
        }
      />

      {members.length === 0 ? (
        <EmptyState
          icon="group"
          title="No team members"
          message="Invite a collaborator to start this workspace."
          actionLabel="Invite Member"
          onAction={() => setInviteOpen(true)}
        />
      ) : (
        <Table columns={columns} data={members} />
      )}

      <Modal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite member">
        <form className="space-y-4" onSubmit={submitInvite} noValidate>
          <Input
            label="Name"
            name="name"
            value={invite.name}
            onChange={(e) => setInvite({ ...invite, name: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            error={touched.name ? inviteErrors.name : undefined}
          />
          <Input
            label="Project role"
            name="role"
            value={invite.role}
            onChange={(e) => setInvite({ ...invite, role: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, role: true }))}
            error={touched.role ? inviteErrors.role : undefined}
          />
          <Input
            label="Institution"
            name="institution"
            value={invite.institution}
            onChange={(e) => setInvite({ ...invite, institution: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, institution: true }))}
            error={touched.institution ? inviteErrors.institution : undefined}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!inviteValid}>Send invite</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
