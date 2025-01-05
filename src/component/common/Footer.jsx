import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer className="footer">
      <span>ĐỒ ÁN TỐT NGHIỆP &copy; {new Date().getFullYear()}</span>
    </Footer>
  );
}

export default FooterComponent;
