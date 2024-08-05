"use client";
import React, { ChangeEvent, FormEvent, FocusEvent, useState } from "react";
import "@/app/globals.css";

const ContactForm = (): React.ReactElement => {
  const [getClientEmail, setGetClientEmail] = useState("");
  const [getMessage, setGetMessage] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [disabledButton, setDisabledButton] = useState(true);
  const [emailSended, setEmailSended] = useState(false);
  const [errorToSendEmail, setErrorToSendEmail] = useState(false);
  const [isSending, setIsSending] = useState(false); // Nuevo estado

  const user = {
    from: "",
    to: "luciogastellu.dev@gmail.com",
    subject: "Wants to connect",
    message: "",
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSending(true); // Se inicia el envío

    user.from = getClientEmail;
    user.message = getMessage;

    try {
      const response = await fetch("https://portfoliolucio.fly.dev/sendEmail", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
          "developer-id": process.env.NEXT_PUBLIC_DEVELOPER_ID as string,
        },
      });
      const data = await response.json();

      if (data.status === 200) setEmailSended(true);
      else setEmailSended(false);

      if (data.status === 500) setErrorToSendEmail(true);
      else setErrorToSendEmail(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false); // Finaliza el envío
      setGetClientEmail("");
      setGetMessage("");
      setDisabledButton(true);

      setTimeout(() => {
        setEmailSended(false);
        setErrorToSendEmail(false);
      }, 5000);
    }
  };

  const validateEmail = (email: string) => {
    const regEx = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if (regEx.test(email)) {
      setValidEmail(true);
      setDisabledButton(false);
    } else {
      setValidEmail(false);
      setDisabledButton(true);
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setGetClientEmail(email);
    validateEmail(email);

    if (email === "") setValidEmail(true);
  };

  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    validateEmail(email);

    if (email === "") setValidEmail(true);
  };

  return (
    <form
      className="w-full px-5 md:max-w-[50%] flex flex-col justify-center items-center gap-5 my-10"
      onSubmit={handleSubmit}
    >
      <input
        name="from"
        type="text"
        placeholder="Email"
        className="w-full p-3 rounded-lg bg-[#363636] placeholder:text-[#f5f5f577] text-[#f5f5f5] outline-none lg:p-5"
        value={getClientEmail}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
      />
      {validEmail ? (
        ""
      ) : (
        <p className="font-paragraph text-[#ff4a57] text-sm">Invalid email.</p>
      )}
      <textarea
        name="message"
        cols={30}
        rows={3}
        placeholder="Mensaje"
        className="w-full p-3 rounded-lg bg-[#363636] placeholder:text-[#f5f5f577] text-[#f5f5f5] outline-none lg:p-5"
        onChange={(e) => setGetMessage(e.target.value)}
        value={getMessage}
      ></textarea>

      <div className="flex w-full justify-end mt-5">
        <button
          className={
            disabledButton
              ? `bg-[#363636] w-1/2 p-3 rounded-xl ${
                  emailSended ? "bg-green-500" : ""
                }`
              : "bg-gradient w-1/2 p-3 rounded-xl"
          }
          disabled={disabledButton || isSending} // Deshabilitar mientras se envía
        >
          <p className="font-semibold text-white md:text-xl">
            {isSending
              ? "Enviando..."
              : emailSended
              ? "Enviado"
              : "Contactame!"}
          </p>
        </button>
      </div>

      {errorToSendEmail ? (
        <div>
          <p className="text-red-500">
            {errorToSendEmail ? "Error al enviar el email (Campo vacío)" : ""}
          </p>
        </div>
      ) : (
        ""
      )}
    </form>
  );
};

export default ContactForm;
