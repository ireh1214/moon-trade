"use client";
import React, { useState } from "react";
import AddUserModal from "../components/AddUserModal";
import Card from "../components/Card";
import BackButton from "../components/BakButton";

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <div className="color_wrap">
      <div className="title">
        <BackButton />
     </div>
      <Card />
      {isModalOpen && (
        <AddUserModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      )}
      <button type="button" onClick={handleOpenModal} className="add_btn">
        나두!
      </button>
    </div>
  );
};

export default Page;
