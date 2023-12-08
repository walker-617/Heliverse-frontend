import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

export default function Home() {

    const [start, setStart] = useState(1);
    const [users, setUsers] = useState([]);

    const [domains, setDomains] = useState([]);
    const [genders, setGenders] = useState([]);

    const [domain, setDomain] = useState();
    const [gender, setGender] = useState();
    const [available, setAvailable] = useState();

    const [searchBy, setSearchBy] = useState();
    const [searchValue, setSearchValue] = useState();
    const searchValRef=useRef();
    const searchByRef=useRef();

    useEffect(() => {
        setUsers([]);
        var params = "start=" + start;
        if (domain) {
            params += "&domain=" + domain;
        }
        if (gender) {
            params += "&gender=" + gender;
        }
        if (available) {
            params += "&available=" + available;
        }
        if(searchBy && searchValue){
            params+="&searchBy="+searchBy;
            params+="&searchValue="+searchValue;
        }
        fetch("http://localhost:5000/get_users?" + params)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setUsers(data);
            })
    }, [start, domain, gender, available, searchBy, searchValue])

    useEffect(() => {
        fetch("http://localhost:5000/get_domains_genders")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setDomains(data.domains);
                setGenders(data.genders);
            })
    }, [])

    function handleGender(x) {
        setStart(1);
        if (gender == x) {
            document.getElementById(x).style.backgroundColor = "transparent";
            setGender("");
            return;
        }
        if (gender) {
            document.getElementById(gender).style.backgroundColor = "transparent";
        }
        setGender(x);
        document.getElementById(x).style.backgroundColor = "var(--light-green)";
    }

    function handleDomain(x) {
        setStart(1);
        if (domain == x) {
            document.getElementById(x).style.backgroundColor = "transparent";
            setDomain("");
            return;
        }
        if (domain) {
            document.getElementById(domain).style.backgroundColor = "transparent";
        }
        setDomain(x);
        document.getElementById(x).style.backgroundColor = "var(--light-blue)";
    }

    function handleAvailable(x) {
        setStart(1);
        if (available == x) {
            document.getElementById(x).style.backgroundColor = "transparent";
            setAvailable("");
            return;
        }
        if (available) {
            document.getElementById(available).style.backgroundColor = "transparent";
        }
        setAvailable(x);
        document.getElementById(x).style.backgroundColor = "var(--light-orange)";
    }

    const handleSearchValue= ()=>{
        setSearchValue(searchValRef.current.value);
    }

    const debounceSearch=debounce(handleSearchValue,0);

    return <div>
        <div className="search-user">
            <input ref={searchValRef} onChange={debounceSearch} type="text" name="user" className="search-input" />
            <select onChange={(e)=>{setSearchBy(e.target.value)}} name="select-by" className="search-select">
                <option value="">Search By - </option>
                <option value="first_name">Search by First name</option>
                <option value="last_name">Search by Last name</option>
                <option value="email">Search by Email</option>
            </select>
        </div>
        <div className="filters">
            <div className="filter gender">
                {genders.map((gender, index) => (
                    <div className="filter-box" id={gender} onClick={() => handleGender(gender)} key={gender}>{gender}</div>
                ))}
            </div>
            <div className="filter domain">
                {domains.map((domain, index) => (
                    <div className="filter-box" id={domain} onClick={() => handleDomain(domain)} key={domain}>{domain}</div>
                ))}
            </div>
            <div className="filter available">
                <div className="filter-box" id="available" onClick={() => handleAvailable("available")}>Available</div>
                <div className="filter-box" id="unavailable" onClick={() => handleAvailable("unavailable")}>Unavailable</div>
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
                        <div>ID - {user.id}</div>
                    </div>
                    <div className="user-image">
                        <img src={user.avatar.replace("50x50", "75x75")} alt="user image" />
                    </div>
                </div>
            )) : ""}
        </div>
        <div className="prev_next">
            {start > 1 ? <div onClick={() => { var x = start; setStart(x - 20); }}>Previous</div> : ""}
            {users.length == 20 ? <div onClick={() => { var x = start; setStart(x + 20) }}>Next</div> : ""}
        </div>
    </div>
}