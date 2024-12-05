import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

function LiveAPI() {
    const [data, setData] = useState<any[]>([]);
    const [matchedData, setMatchedData] = useState<any | null>(null);
    const [reload,setReload] = useState<boolean>(false)
    const [addOrUpdateData , setAddOrUpdateData] = useState<boolean>(false)

    const addbtn = useRef(null);
    const passwordRef = useRef<HTMLInputElement>(null);  
    const emailRef = useRef<HTMLInputElement>(null);

    // State for form fields
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        username: '',
        password: '',
        email: '',
        avatar: ''
    });

    // Get data from the API
    const getData = useCallback(() => {
        axios.get('https://www.melivecode.com/api/users')
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));
    },[])

    useEffect(() => {
        getData(); 
    }, [reload]);

    // Show matched user data based on the first name
    const showData = (fname: string) => {
        axios.get(`https://www.melivecode.com/api/users?search=${fname}`)
            .then((res) => setMatchedData(res.data[0] || null))
            .catch((err) => console.log(err));
    };

    // Handle form field changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Add new data via the API
    const addData = () => {
       (addOrUpdateData)?(()=>{
        axios.put("https://www.melivecode.com/api/users/update",formData)
        .then((res)=>{alert(res.data.message); setReload(prev=>!prev); setAddOrUpdateData(prev=>!prev) }).catch((err)=>{console.log(err.data.message)})
       })():( axios.post('https://www.melivecode.com/api/users/create', formData)
       .then((res) => {
           console.log(res);
           setReload(prev=>!prev)
       })
       .catch((err) => console.log(err)))
        
        setFormData({
            fname: '',
            lname: '',
            username: '',
            password: '',
            email: '',
            avatar: ''
        });
        
        addbtn.current.innerText = 'Add Data'
        passwordRef.current.style.display = 'block';
        emailRef.current.style.display = 'block';
    };

    const updateData = (id: number) => {
        setAddOrUpdateData(prev=>!prev)
        addbtn.current.innerText = 'Update';
        passwordRef.current.style.display = 'none';
        emailRef.current.style.display = 'none';
        
        data.filter((item) => {
            if (item.id === id) {
                setFormData(item);
            }
        });
    };

    const deleteData = (id:number)=>{
        axios.delete(` https://www.melivecode.com/api/users/delete`,{

            data:{id}
        })
        .then((res)=>{alert(res.data.message)
            setReload(prev=>!prev)
        }).catch((err)=>{console.log(err)}
        )
    }

    return (
        <>
            <div className="container mt-5">
            <p className="fade-in-text small text-muted">
                    First add data to implement CRUD operation
            </p>

                {/* Form Inputs */}
                <div className="card p-4 mb-4 shadow">
                    <h3 className="card-title text-center mb-4">User Form</h3>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="fname"
                                value={formData.fname}
                                placeholder="First Name"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="lname"
                                value={formData.lname}
                                placeholder="Last Name"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="username"
                                value={formData.username}
                                placeholder="Username"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="password"
                                name="password"
                                ref={passwordRef}
                                value={formData.password}
                                placeholder="Password"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                ref={emailRef}
                                value={formData.email}
                                placeholder="Email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="avatar"
                                value={formData.avatar}
                                placeholder="Avatar"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <button onClick={addData} ref={addbtn} className="btn btn-primary w-100 mt-3">
                        Add Data
                    </button>
                </div>

                {/* Table to show data */}
                <div className="card shadow">
                    <div className="card-body">
                        <h3 className="card-title text-center mb-4">Users List</h3>
                        <table className="table table-bordered table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>FIRST NAME</th>
                                    <th>LAST NAME</th>
                                    <th>USERNAME</th>
                                    <th>AVATAR</th>
                                    <th>SHOW</th>
                                    <th>UPDATE</th>
                                    <th>DELETE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.map((item: any) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.fname}</td>
                                        <td>{item.lname}</td>
                                        <td>{item.username}</td>
                                        <td>{item.avatar}</td>
                                        <td>
                                            <button onClick={() => showData(item.fname)} className="btn btn-info btn-sm">
                                                Show
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => updateData(item.id)} className="btn btn-warning btn-sm">
                                                Update
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={()=>{deleteData(item.id)}} className="btn btn-danger">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            
            {matchedData && (
                <div className="container mt-5">
                    <div className="card p-4 shadow">
                        <h3 className="card-title text-center mb-4">User Details</h3>
                        <table className="table table-bordered table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>FIRST NAME</th>
                                    <th>LAST NAME</th>
                                    <th>USERNAME</th>
                                    <th>AVATAR</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{matchedData.id}</td>
                                    <td>{matchedData.fname}</td>
                                    <td>{matchedData.lname}</td>
                                    <td>{matchedData.username}</td>
                                    <td>{matchedData.avatar}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}

export default LiveAPI;
