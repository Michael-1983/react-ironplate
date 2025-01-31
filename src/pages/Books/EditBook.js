import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import api from "../../apis/api";
import FormField from "../../components/Form/FormField";

function EditBook(props) {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    synopsis: "",
    releaseYear: "",
    genre: "",
    picture: new File([], ""),
    pictureUrl: "",
    coverImage: "",
  });

  // Loading
  const [loading, setLoading] = useState(false);

  const { id } = useParams(props);

  const navigate = useNavigate();

  useEffect(() => {
    async function user() {
      try {
        const response = await api.get(`/api/book/detail-book/${id}`);
        const coverImage = await handleFileUpload(bookData.picture);

        setBookData({ ...bookData, coverImage, ...response.data });
      } catch (e) {
        console.log(e);
      }
    }
    user();
  }, [id]);

  function handleChange(e) {
    if (e.target.files) {
      return setBookData({
        ...bookData,
        [e.target.name]: e.target.files[0],
      });
    }
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  }

  async function handleFileUpload(file) {
    try {
      const uploadData = new FormData();

      uploadData.append("picture", file);

      const response = await api.post("/api/book/upload", uploadData);

      console.log(response);

      return response.data.url;
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const coverImage = await handleFileUpload(bookData.picture);

      const response = await api.patch(`/api/book/update-book/${id}`, {
        ...bookData,
        coverImage,
      });
      console.log(response);
      setLoading(false);

      navigate("/");
    } catch (err) {
      setLoading(false);
      console.error(err);
      if (err.response) {
        console.error(err.response);
      }
    }
  }

  return (
    <div className="container cadastro">
      <form onSubmit={handleSubmit}>
        <div className="titulo">
          <h1>Editar Livro</h1>
        </div>
        {/* campo do titulo */}
        <div className=" mb-3 ">
          <FormField
            label="Titulo"
            type="text"
            id="title"
            name="title"
            onChange={handleChange}
            value={bookData.title}
            readOnly={loading}
          />
        </div>

        {/* campo do Author */}
        <div className=" mb-3">
          <FormField
            label="Autor(a)"
            type="text"
            id="author"
            name="author"
            onChange={handleChange}
            value={bookData.author}
            readOnly={loading}
          />
        </div>

        {/* campo sinopse do livro */}
        <div className=" mb-3">
          <FormField
            label="Sinopse"
            type="text"
            id="synopsis"
            name="synopsis"
            onChange={handleChange}
            value={bookData.synopsis}
            readOnly={loading}
          />
        </div>

        {/* campo Ano do livro */}
        <div className="mb-3">
          <FormField
            label="Ano do Livro"
            id="releaseYear"
            name="releaseYear"
            onChange={handleChange}
            value={bookData.releaseYear}
            readOnly={loading}
          />
        </div>

        {/* campo Gênero do livro */}
        <div className=" mb-3">
          <FormField
            label="Gênero"
            id="genre"
            name="genre"
            onChange={handleChange}
            value={bookData.genre}
            readOnly={loading}
          />
        </div>
        <div className=" mb-3">
          <FormField
            type="file"
            label="Imagem"
            id="productFormPicture"
            name="picture"
            onChange={handleChange}
            readOnly={loading}
          />
        </div>
        <div className="mb-3 text-end">
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            ) : null}
            Atualizar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBook;
