import React from "react";
// core components
import GridItem from "../../Components/Grid/GridItem";
import GridContainer from "../../Components/Grid/GridContainer.js";
import CustomInput from "../../Components/CustomInput/CustomInput.js";
import Button from "../../Components/CustomButtons/Button.js";
import Card from "../../Components/Card/Card.js";
import CardHeader from "../../Components/Card/CardHeader.js";
import CardBody from "../../Components/Card/CardBody.js";
import CardFooter from "../../Components/Card/CardFooter.js";
const style = { justifyContent: "center", top: "auto" };

export default class RemoveSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      contactDetails: ""
    };
  }

  setName(event) {
    this.setState({ name: event.target.value });
  }

  setContactDetails(event) {
    this.setState({ contactDetails: event.target.value });
  }

  render() {
    const { name, contactDetails } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="success">
                <h4>Remove supplier</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Name"
                      id="name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      onChange={event => this.setName(event)}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer></GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="success"
                  onClick={() =>
                    this.props.handleRemoveSupplier(name, contactDetails)
                  }
                >
                  Remove Supplier
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
