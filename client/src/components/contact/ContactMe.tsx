import React from "react";
import ContactForm from "./ContactForm";

const ContactMe = (): React.ReactElement => {
  return (
    <div className="flex flex-col justify-center items-center" id="contacto">
      <h2 className="font-bold text-[#CCCCCC] text-2xl lg:text-3xl">
        Contacto
      </h2>

      <p className="text-main-color px-5 text-center mt-2 md:text-xl lg:mt-5">
        Contáctame para dar vida a tus ideas.
      </p>
      <ContactForm />
    </div>
  );
};

export default ContactMe;
