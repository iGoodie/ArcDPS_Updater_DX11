import UpdateIcon from "@/assets/icons/update.svg";
import "@/style/main.scss";

function App() {
  return (
    <div id="app">
      <div className="page">
        <div className="app-title">
          <img src={UpdateIcon} height={40} />
          <h1>Arcdps Updater</h1>
          <span className="divider" />
          <h2>For DX11 Update</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
