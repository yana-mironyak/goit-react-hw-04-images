import { useState, useEffect } from 'react';
import fetchGallery from 'helpers/fetchGallery';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import Notiflix from 'notiflix';

const App = () => {
  const [searchImages, setSearchImages] = useState('');
  const [gallery, setGallery] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState({});
  const [totalHits, setTotalHits] = useState('');

  const handleSubmit = ({ searchImage }) => {   
    if (searchImages === searchImage)
      return;

    setSearchImages(searchImage);
    setGallery([]);
    setPage(1);
  };
  
  useEffect(() => {
    if (!searchImages)
      return;
    
    setStatus('pending');

    const getResponse = async () => {
      const response = await fetchGallery(searchImages, page);
      setGallery(prev => [...prev, ...response.hits]);
      setTotalHits(response.totalHits);
      if (response.hits.length === 0) {
        Notiflix.Notify.failure('Something wrong, try again');
      }
    }
    getResponse()
    setStatus('resolved');
    
  }, [searchImages, page])
  
  const handleClick = () => {
    setPage(prevPage => prevPage + 1 );
  }

  const getModalImage = (id) => {
    const galleryItem = gallery.find(item => item.id === id);
    setModalImg(galleryItem)
    setIsModalOpen(true);
  }  

  const closeModal= () => {
    setIsModalOpen(false);
  }
  
  return (
    <>
      <Searchbar onSubmit={handleSubmit} />
      {status === "pending" && <Loader />}
      {(status === "resolved" || gallery.length > 0) && <ImageGallery imageGallery={gallery} openModal={getModalImage} />}
      {(gallery.length > 0 && gallery.length < totalHits) && <Button onClick={handleClick} />}
      {isModalOpen && <Modal largeImgUrl={modalImg.largeImageURL} tag={modalImg.tag} onClose={closeModal} /> }           
    </>
    )
  



  // state = {
  //   searchImages: '',
  //   gallery: [],
  //   page: 1,
  //   status: 'idle',
  //   isModalOpen: false,
  //   modalImg: {},
  //   totalHits: ''
  // }

  // handleSubmit = ({ searchImages }) => {
  //   if (searchImages === this.state.searchImages) {
  //     return;
  //   }
  //   this.setState({ searchImages });
  //   this.setState({ gallery: [], page: 1 });
  // }
  
  // async componentDidUpdate(_, prevState) {
  //   const { searchImages, page} = this.state;
  //   if (prevState.searchImages !== searchImages || prevState.page !== page) {
  //     this.setState({ status: 'pending' });
  //     const response = await fetchGallery(searchImages, page); 
  //     this.setState(prevState => ({ gallery: [...prevState.gallery, ...response.hits], status: 'resolved', totalHits: response.totalHits }));
  //     if (this.state.gallery.length === 0) { <div>Ooooops! I can not find this</div> };
  //   }
  // }

  // handleClick = () => {
  //   this.setState(prevState => ({ page: prevState.page + 1 }));
  // }

  // getModalImage = (id) => {
  //   const galleryItem = this.state.gallery.find(item => item.id === id);
  //   this.setState({ modalImg: { largeImgUrl: galleryItem.largeImageURL, tag: galleryItem.tags }, isModalOpen: true });
  // }

  // closeModal= () => {
  //    this.setState({ isModalOpen: false })
  // }

  // render() {
  //   const { status, gallery, isModalOpen, modalImg, totalHits } = this.state;
  //   return (
  //     <>
  //         <Searchbar onSubmit={this.handleSubmit} />
  //         {status === "pending" && <Loader />}
  //         {(status === "resolved" || gallery.length > 0) && <ImageGallery imageGallery={gallery} openModal={this.getModalImage} />}
  //         {(gallery.length > 0 && gallery.length < totalHits) && <Button onClick={this.handleClick} />}
  //         {isModalOpen && <Modal largeImgUrl={modalImg.largeImgUrl} tag={modalImg.tag} closeModal={this.closeModal} /> }           
  //     </>
  //     )
  // }
}

export default App;
