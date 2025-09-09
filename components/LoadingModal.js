export default function LoadingModal() {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="spinner"></div>
        <h3 style={{marginBottom: '0.5rem'}}>Your Bartender is Thinking</h3>
        <p>Crafting the perfect cocktails for you...</p>
      </div>
    </div>
  );
}