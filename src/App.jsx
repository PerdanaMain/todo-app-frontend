import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import api from "./services/api";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(api + "/todos");
      setTodos(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error :" + error);
    }
  };

  const createHandler = async () => {
    try {
      await axios.post(api + "/todos", {
        title,
      });
      setTitle("");
      fetchTodos();

      Swal.fire({
        title: "Berhasil",
        text: "Todo " + title + " berhasil ditambahkan",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error :" + error);
    }
  };

  const changeHandler = (id) => {
    return async () => {
      const { value: newTitle } = await Swal.fire({
        title: "Ubah Todo",
        input: "text",
        inputLabel: "Todo Baru",
        inputPlaceholder: "Masukkan todo baru",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Todo tidak boleh kosong";
          }
        },
      });

      if (newTitle) {
        try {
          await axios.put(api + `/todos/${id}`, {
            title: newTitle,
          });
          fetchTodos();

          Swal.fire({
            title: "Berhasil",
            text: "Todo berhasil diubah",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error :" + error);
        }
      }
    };
  };

  const deleteHandler = (id) => {
    return async () => {
      const { isConfirmed } = await Swal.fire({
        title: "Anda yakin?",
        text: "Todo yang dihapus tidak dapat dikembalikan",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
      });

      if (isConfirmed) {
        try {
          await axios.delete(api + `/todos/${id}`);
          fetchTodos();

          Swal.fire({
            title: "Berhasil",
            text: "Todo berhasil dihapus",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.error("Error :" + error);
        }
      }
    };
  };

  const statusHandler = async (e, id) => {
    try {
      await axios.put(api + `/todos/${id}/status`, {
        status: e,
      });
      fetchTodos();
    } catch (error) {
      console.error("Error :" + error);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4 container">
      <div className="card border-0 rounded shadow-sm">
        <div className="card-header">
          <h5 className="text-center">Todo APP Sederhana</h5>
        </div>
        <div className="card-body px-5">
          <div className="row">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Tambahkan todo baru"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={createHandler}
              >
                Tambah
              </button>
            </div>
          </div>
          <div className="row">
            <ul className="list-group">
              {isLoading ? (
                <li className="list-group-item">Loading...</li>
              ) : todos.length === 0 ? (
                <li className="list-group-item">Tidak ada data</li>
              ) : (
                todos.map((todo) => (
                  <li
                    className="list-group-item d-flex justify-content-between"
                    key={todo.id}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={todo.status}
                      onChange={(e) => statusHandler(e.target.checked, todo.id)}
                    />
                    <label
                      htmlFor="check"
                      style={{
                        textDecoration: todo.status ? "line-through" : "none",
                      }}
                    >
                      {todo.title}
                    </label>
                    <div className="d-block">
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={changeHandler(todo.id)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={deleteHandler(todo.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
