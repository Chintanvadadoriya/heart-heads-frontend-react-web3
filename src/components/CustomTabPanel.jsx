import { Box, Typography } from "@mui/material";
import { createElement } from "react";

const CustomTabPanel = ({ children, value, index, ...other }) => {
	return createElement(
		"div",
		{
			role: "tabpanel",
			hidden: value !== index,
			id: `simple-tabpanel-${index}`,
			"aria-labelledby": `simple-tab-${index}`,
			...other,
		},
		value === index &&
			createElement(
				Box,
				{ sx: { p: 3 } },
				createElement(Typography, null, children)
			)
	);
};

export default CustomTabPanel;
