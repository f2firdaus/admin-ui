import React, { useEffect, useState } from "react";

const MenuData = () => {
  const [allData, setAlldata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const arrayLength = allData.length();
  const [input, setInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [checkedState, setCheckedState] = useState([]);
  const [selectAll,setSelectAll]=useState(false);
  

  const API_URI =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  // console.log(filterdDatas)
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch(API_URI);
        const data = await response.json();

        if (data) {
          setAlldata(data);
          setFilteredData(data);
        }
      } catch (error) {
        console.log("fetched error", error);
      }
    };
    fetchApi();
  }, [input]);
  useEffect(() => {
    if (filteredData.length) {
      setCheckedState(new Array(filteredData.length).fill(false));
    }
  }, [filteredData]);

  const prevPageBtn = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const currentItem = filteredData.slice(currentPage*10 -10,currentPage*10+1) 
  const nextPageBtn = () => {
    if (currentPage < 5) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      const filterdDatas = allData.filter(
        (item) =>
          item.name.toLowerCase().includes(input.toLowerCase()) ||
          item.email.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredData(filterdDatas);
      setCurrentPage(1);
    }
  };
  // console.log(checkedState)
  const handleDelete = (id) => {
    const updatedData = [...filteredData];
    const index = updatedData.findIndex((idx) => idx.id === id);
    console.log(index);
    updatedData.splice(index, 1);
    setFilteredData(updatedData);
  };
  const handleChecked = (position) => {
    const updatedChecked = checkedState.map((item, id) =>
      String(id) === position ? !item : item
    );

    setCheckedState(updatedChecked);
  };
  const handleAllChecked = () => {
    // const allchecked = [...checkedState];
   const newSelectAll = !selectAll;
   setSelectAll(newSelectAll)
   const updateSelected=[...checkedState];
   currentItem.forEach((item,id)=>{
    const globalIndex=allData.indexOf(item);
    updateSelected[globalIndex]=newSelectAll
   });
   setCheckedState(updateSelected)
  };
  return (
    <div className="menudata">
      <div className="search">
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            name="search"
            id="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search name email"
            className="searchbox"
          />
          <button type="submit" className="searchbtn">
            Search
          </button>
        </form>
        <button>Delete Selected</button>
      </div>
      <div className="table">
        <table>
          <thead>
            <th>
              <input
                onChange={handleAllChecked}
                type="checkbox"
                name=""
                id=""
                checked={selectAll}
                className="checkbox1"
              />
            </th>
            <th>name</th>

            <th>email</th>
            <th>Role</th>
            <th className="icon">Action</th>
          </thead>
          <tbody>
            {filteredData
              .slice(currentPage * 10 - 10, currentPage * 10)
              .map((item) => {
                // const globalIndex = currentPage * 10 - 10 + idx;

                return (
                  <tr
                    key={item.id}
                    className={checkedState[item.id] ? "checked" : ""}
                  >
                    <td>
                      <input
                        type="checkbox"
                        name="select"
                        id="select"
                        checked={checkedState[item.id] || false}
                        onChange={() => handleChecked(item.id)}
                        className="checkbox1"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td className="icon">
                      <button>
                        <img src="./edit.png" alt="" width={25} />
                      </button>
                      <button>
                        <img
                          src="./delete.png"
                          onClick={() => handleDelete(item.id)}
                          alt="delete"
                          width={25}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span onClick={prevPageBtn}>prev</span>
        <span onClick={() => setCurrentPage(1)}>first page</span>
        {allData.length > 0 &&
          [...Array(Math.floor(allData.length / 10) + 1)].map((_, i) => {
            return (
              <span
                key={i}
                className={`number ${
                  currentPage === i + 1 ? "number_selected" : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </span>
            );
          })}

        <span onClick={nextPageBtn}>next</span>
        <span onClick={() => setCurrentPage(5)}>lastPage</span>
      </div>
    </div>
  );
};

export default MenuData;
