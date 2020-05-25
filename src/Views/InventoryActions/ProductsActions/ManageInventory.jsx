import React from "react";
import GridItem from "../../../Components/Grid/GridItem";
import GridContainer from "../../../Components/Grid/GridContainer.js";
import ShowIcon from "@material-ui/icons/Visibility";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "../../../Components/Card/Card.js";
import CardHeader from "../../../Components/Card/CardHeader.js";
import {
  AddProduct,
  EditProduct,
  RemoveProduct,
  ShowProductDetails,
} from "../../index";
import {
  handleAddProduct,
  handleEditProduct,
  handleRemoveProduct,
} from "../../../Handlers/Handlers";
import {
  showActionHook,
  addActionHook,
  editActionHook,
  removeActionHook,
} from "../../../consts/data-hooks";
import {
  isAtLeastShiftManager,
  isAtLeastDeputyManager,
} from "../../../consts/permissions";
const style = { justifyContent: "center", top: "auto" };
const iconStyle = {
  marginTop: "-10px",
  boxShadow: "none",
  backgroundColor: "unset",
  color: "white",
};

export default class ManageInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { action: "show" };
  }

  onChange = (action) => {
    this.setState({ action });
  };

  render() {
    return (
      <div>
        <GridContainer style={style}>
          <GridItem xs={12} sm={12} md={6}>
            <Card style={{ backgroundColor: "#FFFFF0" }}>
              <CardHeader color="info">
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    <h4 style={{ margin: "auto" }}>Manage Inventory</h4>
                  </GridItem>
                  {isAtLeastShiftManager(this.props.permission) && (
                    <Tooltip title="Show" aria-label="show">
                      <Fab
                        color="default"
                        size="small"
                        onClick={() => this.onChange("show")}
                        style={iconStyle}
                        data-hook={showActionHook}
                      >
                        <ShowIcon />
                      </Fab>
                    </Tooltip>
                  )}
                  {isAtLeastDeputyManager(this.props.permission) && (
                    <Tooltip title="Add" aria-label="add">
                      <Fab
                        color="default"
                        size="small"
                        onClick={() => this.onChange("add")}
                        style={iconStyle}
                        data-hook={addActionHook}
                      >
                        <AddIcon />
                      </Fab>
                    </Tooltip>
                  )}
                  {isAtLeastShiftManager(this.props.permission) && (
                    <Tooltip title="Edit" aria-label="edit">
                      <Fab
                        color="default"
                        size="small"
                        onClick={() => this.onChange("edit")}
                        style={iconStyle}
                        data-hook={editActionHook}
                      >
                        <EditIcon />
                      </Fab>
                    </Tooltip>
                  )}
                  {isAtLeastDeputyManager(this.props.permission) && (
                    <Tooltip title="Delete" aria-label="delete">
                      <Fab
                        color="default"
                        size="small"
                        onClick={() => this.onChange("delete")}
                        style={iconStyle}
                        data-hook={removeActionHook}
                      >
                        <DeleteIcon />
                      </Fab>
                    </Tooltip>
                  )}
                </GridContainer>
              </CardHeader>
              {this.state.action === "show" && <ShowProductDetails />}
              {this.state.action === "add" && (
                <AddProduct handleAddProduct={handleAddProduct}></AddProduct>
              )}
              {this.state.action === "edit" && (
                <EditProduct
                  handleEditProduct={handleEditProduct}
                  {...this.props}
                ></EditProduct>
              )}
              {this.state.action === "delete" && (
                <RemoveProduct
                  handleRemoveProduct={handleRemoveProduct}
                ></RemoveProduct>
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
