import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Offcanvas, Row } from 'react-bootstrap'
import './App.css'

const peps = localStorage.getItem('people') ? JSON.parse(localStorage.getItem('people')) : [];

function App() {
  const [people, addPeople] = useState({});
  const [checked, addChecked] = useState([]);
  const [friend, listFriends] = useState([]);
  const [person, addPerson] = useState('');
  const [relation, setRelation] = useState([]);
  const [pathTo, setPathTo] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  useEffect(() => {
    addPeople(peps);
  }, [])

  useEffect(() => {
    if(relation.length==2){
      checkRelation(people, relation[0], relation[1], 0, []);
    }
  }, [relation])

  // useEffect(() => {
  //   console.log(pathTo);
  // }, [pathTo])
  

  const add = (e) => {
    e.preventDefault();
    if(e.target.name.value!==''){
      const name = {};
      name[e.target.name.value] = {"relations": []};
      localStorage.setItem('people', JSON.stringify({...name, ...people}));
      // console.log(JSON.parse(localStorage.getItem('people')));
      addPeople(JSON.parse(localStorage.getItem('people')));
      e.target.name.value = '';
    }
  }

  let path = [];
  const checkRelation = (graph, src, dst, index, visited) => {
    if (visited[src]) return;
    visited[src]=true;
    path[index++]=src;

    if (src === dst){
        let route = [];
        for(let i=0;i<index;i++)
          route.unshift(path[i]);
        // console.log(route);
        let xpathTo = pathTo;
        xpathTo.push(route);
        setPathTo([...xpathTo]);
        console.log("Relation Found!");
        setRelation([]);
    } else {
      for (let neighbor of graph[src].relations) {
        if (!visited[neighbor]) {
          checkRelation(graph, neighbor, dst, index, visited);
        }
      }
    }

    setRelation([]);
    index--;
    visited[src]=false;
  };

  const handleChange = (e) => {
    // console.log(e.target.checked, e.target.id);
    if(e.target.checked) addChecked([e.target.id,...checked]);
    else addChecked(checked.filter(c => c!==e.target.id));
  }

  const addFriends = (e) => {
    e.preventDefault();
    console.log(checked);
    checked.length && checked.map((c) => {
      const peps = people;
      const rep = new Set(peps[person].relations);
      const rep2 = new Set(peps[c].relations);
      if(!rep.has(c)) peps[person] = {"relations": [c, ...peps[person].relations]};
      if(!rep2.has(person)) peps[c] = {"relations": [person, ...peps[c].relations]};
  
      localStorage.setItem('people', JSON.stringify(peps));
      addPeople(JSON.parse(localStorage.getItem('people')));
    })
    addChecked([]);
    listFriends([]);
    handleClose();
  }

  const listFriend = (f) => {
    listFriends(Object.keys(people).filter((i) => i!==f));
    addPerson(f);
  }

  return (
    <div className="App">
    <Form onSubmit={(e) => add(e)}>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Person Name</Form.Label>
        <Form.Control type="text" />
      </Form.Group>
      
      <Button variant="primary" type="submit">
        Add
      </Button>
    </Form>
    <Row sm={1} lg={2} style={{marginTop: '15px'}}>
      <Col style={{overflow: 'auto', height: '600px'}}>
        {Object.keys(people).map((person, i) =>
          <Card key={i} style={{ width: '100%', marginBottom: '20px' }}>
          <span className={"select " + ((person===relation[0] || person===relation[1]) && 'bg-primary')} onClick={() => {
            setPathTo([]);
            console.log("clicked "+relation.length);
            setRelation([person, ...relation]);
            }}></span>

          <Card.Body>
            <Card.Title><b>Name: </b>{person}</Card.Title>
            <b>Friends with: </b>
            <Card.Text>
              {people[person].relations.length!=0 && people[person].relations.map((r, i) => 
                <Badge bg="secondary" className="me-1" key={i}>
                {r}
                </Badge>
              )}
            </Card.Text>
            <Button variant="primary" size='sm' onClick={() => {listFriend(person); handleShow()}}>Add Friend</Button>
          </Card.Body>
        </Card>)}
      </Col>
      <Col>
        <Card style={{ width: '100%', height: '100%', padding: "20px"}}>
          {pathTo.length>0 ? <h2 style={{marginBottom: '5px'}}><b> Found {pathTo.length} Relationship</b></h2> : <h2 align='center'><b>Select Any Two Person</b></h2>}
          {pathTo.map((route, i) =>
            <Card key={i} style={{marginBlock: '10px'}}>
            <Card.Body>
              {/* <Card.Title><b>{route.length}</b></Card.Title> */}
              {route.map((r, i) =>
                <Card.Title key={i} className="path">
                  {i!=route.length-1 ? r+' ►' : r}
                </Card.Title>
              )}
            </Card.Body>
          </Card>)}
        </Card>
      </Col>
    </Row>

    <Offcanvas show={show} onHide={handleClose} placement='end'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add Friend</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
      {/* {friend.map(f =>
        <h4>{f}</h4>)} */}
        <Form onSubmit={(e) => addFriends(e)}>
        {friend.map((f, i) => (
          <Form.Check
              label={f}
              name='friends'
              type='checkbox'
              onChange={(e) => handleChange(e)}
              id={f}
              key={i}
            />
        ))}
        <Button variant="primary" type="submit" className="mt-2">
          Add
        </Button>
      </Form>
      </Offcanvas.Body>
    </Offcanvas>
    </div>
  )
}

export default App
