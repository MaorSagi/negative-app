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
import { handleGetSuppliers } from "../../../Handlers/Handlers";
import { userNameHook } from "../../../consts/data-hooks";
const style = { justifyContent: "center", top: "auto" };

export default class RemoveSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierName: "",
      contactDetails: ""
    };
    this.setInitialState();
  }

  setInitialState = () => {
    handleGetSuppliers(localStorage.getItem("username"))
      .then(response => response.json())
      .then(state => {
        this.setState({ suppliers: state.result });
      });
  };

  setSupplierName = supplierName => {
    this.setState({ supplierName });
  };

  setContactDetails(event) {
    this.setState({ contactDetails: event.target.value });
  }

  render() {
    const { supplierName, contactDetails } = this.state;
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4 style={{ margin: "auto" }}>Remove supplier</h4>
              </CardHeader>
              <CardBody>
                <GridContainer style={style}>
                  <GridItem xs={12} sm={12} md={6}>
                    <ComboBox
                      id={"supplierName"}
                      items={this.state.suppliers}
                      boxLabel={"Choose supplier"}
                      setName={this.setSupplierName}
                      isMultiple={false}
                      data-hook={userNameHook}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer></GridContainer>
              </CardBody>
              <CardFooter style={{ justifyContent: "center" }}>
                <Button
                  color="info"
                  onClick={() => {
                    if (this.state.supplierName) {
                      this.props
                        .handleRemoveSupplier(supplierName, contactDetails)
                        .then(response => response.json())
                        .then(state => {
                          alert(state.result);
                          this.setInitialState();
                        });
                    } else {
                      alert("Supplier name is required.");
                    }
                  }}
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
