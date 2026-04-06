export default function RoleSwitcher({ currentRole, onRoleChange }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-xs font-medium px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: currentRole === 'Admin' ? '#0F4184' : '#e2e8f0',
          color: currentRole === 'Admin' ? 'white' : '#4a5568',
        }}
      >
        {currentRole}
      </span>
      <select
        value={currentRole}
        onChange={e => onRoleChange(e.target.value)}
        className="input-field"
        style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
        aria-label="Switch role"
      >
        <option value="Viewer">Viewer</option>
        <option value="Admin">Admin</option>
      </select>
    </div>
  );
}
