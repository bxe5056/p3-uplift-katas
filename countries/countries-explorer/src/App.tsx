import CountryList from "./pages/CountryList";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1 style={{ textAlign: "center" }}>Countries Explorer</h1>
      </header>
      <main>
        <CountryList />
      </main>
    </div>
  );
}
