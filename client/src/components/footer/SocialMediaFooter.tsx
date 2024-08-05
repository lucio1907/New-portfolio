import React from "react";

const SocialMediaFooter = () => {
  return (
    <div className="flex gap-5">
      <a
        href="https://github.com/lucio1907"
        className="hover:rounded-3xl hover:shadow-xl hover:shadow-[#E70FAA] hover:bg-[#e70faaa0] transition-all ease-in duration-150"
        target="_blank"
      >
        <img src="/Github.webp" alt="github" className="w-[30px] h-[30px]" />
      </a>
      <a
        href="https://x.com/Lu_Gastellu"
        className="hover:rounded-3xl hover:shadow-xl hover:shadow-slate-600 hover:bg-slate-600 transition-all ease-in duration-150"
        target="_blank"
      >
        <img src="/Twitter.webp" alt="twitter" className="w-[30px] h-[30px]" />
      </a>
      <a
        href="https://www.linkedin.com/in/luciogastellu/"
        className="hover:rounded-3xl hover:shadow-xl hover:shadow-[#0b65c3] hover:bg-[#0b65c3] transition-all ease-in duration-150"
        target="_blank"
      >
        <img
          src="/Linkedin.webp"
          alt="linkedin"
          className="w-[30px] h-[30px]"
        />
      </a>
    </div>
  );
};

export default SocialMediaFooter;
