export default function Header({ subtitle }) {
  return (
    <header className="app__header">
      <h1>My Tasks</h1>
      <p className="app__subtitle">{subtitle}</p>
    </header>
  );
}
