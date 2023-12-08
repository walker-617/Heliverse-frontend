import { useEffect, useState } from "react"

export default function Home() {

    const [start, setStart] = useState(1);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [domains, setDomains] = useState([]);
    const [domain, setDomain] = useState();
    const [gender, setGender] = useState();
    const [available, setAvailable] = useState();

    useEffect(() => {
        const params = "";
        if (domain) {
            params += "&domain=${domain}"
        }
        if (gender) {
            params += "&gender=${gender}"
        }
        if (available) {
            params += "&available=${available}"
        }
        fetch("http://localhost:5000/get_users?start=${start}" + params)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
    }, [start,domain,gender,available])

    useEffect(() => {
        fetch("http://localhost:5000/get_domains")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setDomains(data);
            })
    }, [])

    return <div>
        <div className="search-user">
            <input type="text" name="user" className="search-input" />
            <select name="select-by" className="search-select">
                <option defaultValue="id">Search by ID</option>
                <option value="first_name">Search by First name</option>
                <option value="last_name">Search by Last name</option>
                <option value="email">Search by Email</option>
            </select>
        </div>
        <div className="filters">
            <div className="filter gender">
                <div className="filter-box">Male</div>
                <div className="filter-box">Female</div>
            </div>
            <div className="filter domain">
                {domains.map((domain, index) => (
                    <div className="filter-box" key={domain}>{domain}</div>
                ))}
            </div>
            <div className="filter available">
                <div className="filter-box">Available</div>
                <div className="filter-box">Unavailable</div>
            </div>
        </div>
        <div className="users">
            {users && users.length ? users.map((user, index) => (
                <div className="user" key={user.id}>
                    <div className="user-details">
                        <div>{user.first_name + " " + user.last_name}</div>
                        <div>{user.email}</div>
                        <div>{user.gender}</div>
                        <div>{user.domain}</div>
                        {user.available ? <div style={{ color: "green" }}>available</div> : <div style={{ color: "red" }}>unavailable</div>}
                    </div>
                    <div className="user-image">
                        <img src={user.avatar.replace("50x50", "75x75")} alt="user image" />
                    </div>
                </div>
            )) : ""}
        </div>
    </div>
}