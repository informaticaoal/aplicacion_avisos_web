export default function NuevoAviso() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title">Crear nuevo aviso</h2>
          <form>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Título del aviso</span>
              </label>
              <input type="text" placeholder="Título" className="input input-bordered" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
