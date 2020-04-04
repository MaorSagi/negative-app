import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { manageEmployeesPath, manageSuppliersPath } from "../../consts/paths";
import { employeesTabHook, suppliersTabHook } from "../../consts/data-hooks";
import Tab from "@material-ui/core/Tab";

export default function UserActionsDropDownTab(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = path => {
    setAnchorEl(null);
    props.handleTabChange && props.handleTabChange(path);
  };

  return (
    <>
      <Button
        aria-controls="drop-down-tab"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ textTransform: "none" }}
        {...props}
      >
        User Actions
      </Button>
      <Menu
        id="drop-down-tab"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link to={manageEmployeesPath}>
          <MenuItem
            value={1}
            onClick={handleClose}
            data-hook={employeesTabHook}
          >
            <Tab label="Manage Employees" style={{ textTransform: "none" }} />
          </MenuItem>
        </Link>
        <Link to={manageSuppliersPath}>
          <MenuItem
            value={1}
            onClick={handleClose}
            data-hook={suppliersTabHook}
          >
            <Tab label="Manage Suppliers" style={{ textTransform: "none" }} />
          </MenuItem>
        </Link>
      </Menu>
    </>
  );
}
