import React from "react";
// core components
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import Button from "../../../Components/CustomButtons/Button.js";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import CardBody from "../../../Components/Card/CardBody.js";
import CardFooter from "../../../Components/Card/CardFooter.js";
import ComboBox from "../../../Components/AutoComplete";
import { handleGetMovies } from "../../../Handlers/Handlers";
import { movieNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class EditMovie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieName: "",
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetMovies(localStorage.getItem("username"))
      .then((response) => response.json())
      .then((state) => {
        this.setState({ movies: state.result });
      });
  };

  setMovieName = (movieName) => {
    this.setState({ movieName: movieName });
  };

  render() {
    const { movieName } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Remove movie</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"movieName"}
                      items={this.state.movies}
                      boxLabel={"Choose movie"}
                      setName={this.setMovieName}
                      isMultiple={false}
                      data-hook={movieNameHook}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="info"
                  onClick={() => {
                    if (movieName) {
                      this.props
                        .handleRemoveMovie(movieName)
                        .then((response) => response.json())
                        .then((state) => {
                          alert(state.result);
                          this.setInitialState();
                        });
                    } else {
                      alert("movie name is required");
                    }
                  }}
                >
                  Remove Movie
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
