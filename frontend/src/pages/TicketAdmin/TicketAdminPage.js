import { useEffect, useState } from "react";
import classes from "./ticketAdminPage.module.css";
import { Link, useParams } from "react-router-dom";
import { deleteById, getAll, search } from "../../services/ticketService";
import NotFound from "../../components/NotFound/NotFound";
import Title from "../../components/Title/Title";
import Search from "../../components/Search/Search";
import { toast } from "react-toastify";

export default function TicketAdminPage() {
  const [tickets, setTickets] = useState();
  const { searchTerm } = useParams();

  useEffect(() => {
    const loadTickets = async () => {
      const tickets = searchTerm ? await search(searchTerm) : await getAll();
      setTickets(tickets);
    };
    loadTickets();
  }, [searchTerm]);

  const TicketsNotFound = () => {
    if (tickets && tickets.length > 0) return;

    return searchTerm ? (
      <NotFound linkRoute="/admin/tickets" linkText="Show All" />
    ) : (
      <NotFound linkRoute="/dashboard" linkText="Back to dashboard!" />
    );
  };

  const deleteTicket = async (ticket) => {
    const confirmed = window.confirm(`Delete ticket ${ticket.label}?`);
    if (!confirmed) return;

    await deleteById(ticket.id);
    toast.success(`"${ticket.label}" Has Been Removed!`);
    setTickets(tickets.filter((f) => f.label !== ticket.id));
  };

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <Title title="Manage Tickets" margin="1rem auto" />
        <Search
          searchRoute="/admin/tickets/"
          defaultRoute="/admin/tickets"
          margin="1rem 0"
          placeholder="Search Tickets"
        />
        <Link to="/admin/addFood" className={classes.add_ticket}>
          Add Ticket +
        </Link>
        <TicketsNotFound />
        {tickets &&
          tickets.map((ticket) => (
            <div key={ticket.id} className={classes.list_item}>
              <Link to={"/cart"} className={classes.ticket_code}>
                {ticket.code}
              </Link>
              {ticket.label}
              <div className={classes.actions}>
                <Link to={"/admin/editFood/" + ticket.id}>Edit</Link>
                <Link onClick={() => deleteTicket(ticket)}>Delete</Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
