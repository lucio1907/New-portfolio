import React from "react";
import ContactForm from "./ContactForm";

const ContactMe = (): React.ReactElement => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="font-bold text-[#CCCCCC] text-2xl lg:text-3xl">
        Contacto
      </h2>
      <ContactForm />
    </div>
  );
};

export default ContactMe;
