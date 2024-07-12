import { useState } from "react";
import SearchBar from "../search-bar/SearchBar";
import Pagination from "./pagination/Pagination";
import UserTable from "./user-table/UserTable";
import { useEffect } from "react";
import AddEditUser from "./add-edit-user/AddEditUser";
import UserDetails from "./user-details/UserDetails";
import DeleteUser from "./delete-user/DeleteUser";

const baseUrl = "http://localhost:3030/jsonstore";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(null);
    const [showDeleteUserId, setShowDeleteUserId] = useState(null);

    useEffect(() => {
        async function getUsers() {
            const response = await fetch(`${baseUrl}/users`);
            const data = await response.json();
            const users = Object.values(data);

            setUsers(users);
        }

        try {
            getUsers();
        } catch (error) {
            alert(error.message);
        }
    }, [showAddForm, showDeleteUserId]);

    const addUserButtonHandler = () => {
        setShowAddForm(true);
    };

    const closeAddForm = () => {
        setShowAddForm(false);
    };

    const showDetailsModalHandler = (userId) => {
        setShowDetailsModal(userId);
    };

    const closeDetailsModalHandler = () => {
        setShowDetailsModal(null);
    };

    const showDeleteUserModal = (userId) => {
        setShowDeleteUserId(userId);
    };

    const closeDeleteUserModal = () => {
        setShowDeleteUserId(null);
    };

    const AddUserHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const newUserData = Object.fromEntries(formData);
        const newUser = {
            firstName: newUserData.firstName,
            lastName: newUserData.lastName,
            email: newUserData.email,
            phoneNumber: newUserData.phoneNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            imageUrl: newUserData.imageUrl,
            address: {
                country: newUserData.country,
                city: newUserData.city,
                street: newUserData.street,
                streetNumber: newUserData.streetNumber
            }
        }

        const response = await fetch(`${baseUrl}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        });

        setShowAddForm(false);
    };

    const confirmDeleteHandler = async (event, userId) => {
        event.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/users/${userId}`, {
                method: "DELETE",
            });
        } catch (error) {
            console.log(error);
        }

        setShowDeleteUserId(null);
    };

    return (
        <>
            <section className="card users-container">
                {/* <!-- Search bar component --> */}
                <SearchBar />

                {/* <!-- Table component --> */}
                <UserTable
                    users={users}
                    showDetailsHandler={showDetailsModalHandler}
                    deleteClickHandler={showDeleteUserModal}
                />

                {/* <!-- Create/Edit Form component  --> */}
                {showAddForm && (
                    <AddEditUser
                        closeHandler={closeAddForm}
                        saveHandler={AddUserHandler}
                    />
                )}

                {/* <!-- User details component  --> */}
                {showDetailsModal && (
                    <UserDetails
                        user={users.find(
                            (user) => user._id === showDetailsModal
                        )}
                        closeHandler={closeDetailsModalHandler}
                    />
                )}

                {/* <!-- Delete user component  --> */}
                {showDeleteUserId && (
                    <DeleteUser 
                        closeHandler={closeDeleteUserModal} 
                        confirmDeleteHandler={confirmDeleteHandler}
                        userId = {showDeleteUserId}
                        />
                )}

                {/* <!-- New user button  --> */}
                <button className="btn-add btn" onClick={addUserButtonHandler}>
                    Add new user
                </button>

                {/* <!-- Pagination component  --> */}
                <Pagination />
            </section>
        </>
    );
}
