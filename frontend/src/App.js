import {
  BrowserRouter as Router,Routes, Route
} from 'react-router-dom';
import FileUpload from './Components/FileUpload';

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route exact path='/' element={< Home />}></Route>
    //     <Route exact path='/#' element={< Home />}></Route>
    //     <Route exact path='/fixtures' element={< Fixtures />}></Route>
    //     <Route exact path='/results' element={< Results />}></Route>
    //     <Route exact path='/tables' element={< Tables />}></Route>
    //     <Route exact path='/stats' element={< Home />}></Route>

        
    //   </Routes>
    // </Router>
    <div>
      <h1>Plant Disease Detection</h1>
      <FileUpload />
      
    </div>


  );
}

export default App;
