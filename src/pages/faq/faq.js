import React, { useEffect } from "react";
import GraphicsImg from "../../assets/images/graphics-img.png";
import GraphicsImgTwo from "../../assets/images/graphics-img-2.png";
import "./faq.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

import { FAQS } from "./faqList";
import { useLocation } from "react-router-dom";

function Faq() {
    const location = useLocation();
    useEffect(() => {
        if (location.state && location.state.fromExploreButton) {
            const activeFaqIndex = location.state.activeFaqIndex || 0;
            const accordionElement = document.getElementById(
                `panel${activeFaqIndex + 1}-header`
            );
            if (accordionElement) {
                accordionElement.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location.state]);

    return (
        <siv>
            <div className="faq-main">
                {/* <HeaderCnft /> */}
                <div className="common-block-graphics">
                    <img src={GraphicsImg} alt="" />
                </div>
                <div className="common-block-graphics-two">
                    <img src={GraphicsImgTwo} alt="" />
                </div>
                <div className="faq-inner">
                    <div className="container">
                        <div className="faq-inner-title">
                            <h3>Frequently Asked Questions</h3>
                        </div>
                        {FAQS.map(({ question, answer }, index) => {
                            const check =
                                index ===
                                    (location.state &&
                                        location.state.activeFaqIndex) || 0;

                            return (
                                <Accordion key={index} defaultExpanded={check}>
                                    <AccordionSummary
                                        id={`panel${index + 1}-header`}
                                    >
                                        <Typography>{question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>{answer}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </div>
                </div>
            </div>
        </siv>
    );
}

export default Faq;
