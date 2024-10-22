"use client";
import React, { useState } from "react";
import AddUserModal from "../../components/AddUserModal";
import Card from "../../components/Card";

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <div className="color_wrap">
      <h3 className="title">MoonPair</h3>
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
