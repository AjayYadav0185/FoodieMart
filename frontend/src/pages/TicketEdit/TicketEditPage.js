import { useParams } from "react-router-dom";
import classes from "./ticketEdit.module.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { add, getById, update } from "../../services/ticketService";
import Title from "../../components/Title/Title";
import InputContainer from "../../components/InputContainer/InputContainer";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function TicketEditPage() {
  const { ticketId } = useParams();
  const isEditMode = !!ticketId;

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!isEditMode) return;

    getById(ticketId).then((ticket) => {
      if (!ticket) return;
      reset(ticket);
    });
  }, [ticketId]);

  const submit = async (ticketData) => {
    var ticket = { ...ticketData };

    ticket.mark = ticket.mark / 100;

    if (isEditMode) {
      await update(ticket);
      toast.success(`Ticket "${ticket.label}" updated successfully!`);
      return;
    }

    const newTicket = await add(ticket);
    toast.success(`Ticket "${ticket.label}" added successfully!`);
    navigate("/admin/editTicket/" + newTicket.id, { replace: true });
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title={isEditMode ? "Edit Ticket" : "Add Ticket"} />
        <form
          className={classes.form}
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          <Input
            type="text"
            label="Label"
            {...register("label", { required: true })}
            error={errors.label}
          />

          <Input
            type="text"
            label="Code"
            {...register("code", { required: true })}
            error={errors.code}
          />

          <Input
            type="number"
            label="Mark"
            {...register("mark", { required: true })}
            error={errors.mark}
          />
          <Input label="Is Active" type="checkbox" {...register("isActive")} />

          <Button type="submit" text={isEditMode ? "Update" : "Create"} />
        </form>
      </div>
    </div>
  );
}
