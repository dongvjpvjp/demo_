import React, { useEffect, useLayoutEffect, useState, useContext } from 'react';
import Context from './Context';
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Avatar from './download.jpg';
import axios from 'axios'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const Container = styled.div({
    width: "100vw", height: "100vh"
})
const Nav = styled.div({
    positionn: "fixed-top", display: "flex", justifyContent: "space-between", height: "10%", width: "100%", background: "linear-gradient(87deg, #5e72e4 0, #825ee4 100%) !important"
})
const NavItem = styled.div({
    display: "flex", justifyContent: "center", alignItems: "center", height: "100%"
})
const Span = styled.span`
color:white
`
const Img = styled.img({
    objectFit: 'cover',
    height: '100%',
    opacity: "0.3",
    borderRadius: "20%",
})
const Flex = styled.div({
    display: "flex"
})
const Td = styled.td({ padding: "12px 15px", wordBreak: "break-word", textAlign: "center" })
const Th = styled.th({ padding: "12px 15px", wordBreak: "break-word", textAlign: "center" })
const Table = styled.table({
    borderCollapse: "collapse",
    margin: "25 0",
    fontSize: "0.9em",
    fontFamily: "sans-serif",
    width: "100%",
    height: "100%",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.15)"
})
const Button = styled.button({
    padding: "5px",
    margin: "5px",
    backgroundColor: "#009879",
    color: "#ffffff",
    border: "0px",
    borderRadius: "10px"
})
const ListBN = (props) => {
    return props.data.map((item) => {
        return <option key={item.id} value={item.id}>{item.fullname}</option>
    })
}
export default function Home() {
    const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }];
    const [state, setState] = useContext(Context)
    axios.defaults.baseURL = "http://20.119.48.31:8088";
    // axios.defaults.baseURL = "http://127.0.0.1:8000";
    axios.defaults.headers.common['Authorization'] = `bearer ${state.UserInfo.access_token}`;

    const [userData, setUserData] = useState() //all benh nhan cua bac si 
    const [selectPation, setSelectPation] = useState(null); //select benh nhan
    const [maxChart, setMaxChart] = useState(); //chart data
    const [schedule, setSchedule] = useState(); //schedule data
    const [inputSchedule, setInputSchedule] = useState(); //INPUT THEM SUA XOA
    const [visible, setVisible] = useState(0);
    const [scheduleSTT, setScheduleSTT] = useState();

    const navigate = useNavigate();

    const logOutHandler = (e) => {
        e.preventDefault();
        axios.post(`/api/auth/logout`, {});
        setState({ type: "isLogin" })
        setState({ type: "UserInfo", payload: null })
        navigate('/');
    }

    useEffect(() => {
        const run = async () => {
            const res = await axios.get("/api/user/list-user-by-manager");
            console.log("/api/user/list-user-by-manager", res)
            if (res.data) setUserData(res.data.data)
        }
        run();


    }, [])
    useEffect(() => {
        const run = async () => {
            const res = await axios.get(`/api/max30110/get-list-by-user/${selectPation?.id}`, {
                headers: {
                    pageIndex: 1,
                    pageSize: 999,
                    time: selectPation?.time
                }
            })
            console.log(`/api/max30110/get-list-by-user/`, res.data)
            setMaxChart(res.data.data.data);
            const res2 = await axios.get(`/api/admin/schedule/get-list-schedule-by-patient/${selectPation?.id}`, {
                headers: {
                    pageIndex: 1,
                    pageSize: 999,
                    time: selectPation?.time
                }
            })
            console.log(`/api/admin/schedule/get-list-schedule-by-patient`, res2)
            setSchedule(res2.data.data.data)
        }
        run();
        // /api/max30110/get-list-by-user/
    }, [selectPation,inputSchedule])

    const addScheduleHandler = (e) => {
        e.preventDefault();
        setVisible(1);
    }
    const onChangeHandler = (e) => {
        e.preventDefault();
        setInputSchedule({ ...inputSchedule, [e.target.name]: e.target.value })
    }
    const onAddHandler = (e) => {
        e.preventDefault();
        const run = async () => {
            const res = await axios.post("/api/admin/schedule/create", inputSchedule)
            setInputSchedule({});
            console.log(`/api/admin/schedule/create`, res)
        }
        setVisible(0);
        run();
    }
    const onEditHandler = (e) => {
        e.preventDefault();
        const run = async () => {
            const res = await axios.put(`/api/admin/schedule/update/${inputSchedule.id}`, inputSchedule)
            setInputSchedule({});
            console.log(`/api/admin/schedule/update/`, res)
        }
        setVisible(0);
        run();
    }

    const getPationData = (index) => {
        switch (state.UserInfo.user.role) {
            case 2:
                if (userData) {
                    if (userData.length > 0 && index === 1) {
                        return userData.map((item, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #dddddd" }} onClick={() => {
                                setSelectPation({ ...selectPation, ...item, index: index })
                            }}>
                                <Td>
                                    {index}
                                </Td>
                                <Td>
                                    {item.fullname}
                                </Td>
                                <Td>
                                    {item.age}
                                </Td>
                                <Td>
                                    {item.address}
                                </Td>
                                {/* <Td>
                            <Button>Sửa</Button>
                            <Button>Xoá</Button>
                        </Td> */}

                            </tr>
                        ))
                    }
                    else if (userData[selectPation?.index] && userData[selectPation?.index]?.lstManager?.length > 0 && index === 2) {
                        return userData[selectPation?.index].lstManager.map((item, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #dddddd" }}>
                                <Td>
                                    {index}
                                </Td>
                                <Td>
                                    {item.fullname}
                                </Td>
                                <Td>
                                    {item.age}
                                </Td>
                                <Td>
                                    {item.address}
                                </Td>
                                {/* <Td>
                        <Button>Sửa</Button>
                        <Button>Xoá</Button>
                    </Td> */}

                            </tr>
                        ))
                    }
                    else if (maxChart && maxChart?.length > 0 && index === 4) {
                        return maxChart.map((item, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #dddddd" }}>
                                <Td>
                                    {index}
                                </Td>
                                <Td>
                                    {item.id}
                                </Td>
                                <Td>
                                    {item.ir}
                                </Td>
                                <Td>
                                    {item.bpm}
                                </Td>
                                <Td>
                                    {item.spo2}
                                </Td>
                                <Td>
                                    
                                </Td>
                                <Td>
                                    
                                </Td>
                                <Td>
                                    {item.create_at}
                                </Td>
                              
                               
                            </tr>
                        ))
                    }
                    else if (schedule && schedule?.length > 0 && index === 3) {

                        return schedule.map((item, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #dddddd" }}>
                                          <Td>
                                    {index}
                                </Td>
                                <Td>
                                    {item.content}
                                </Td>
                                <Td>
                                    {item.id}
                                </Td>
                                
                                <Td>
                                    {item.time}
                                </Td>
                                <Td>
                                    {item.status === 1 ? "Đang chờ lịch" : item.status === 2 ? "Hoàn thành" : "Quá hạn"} 
                                </Td>
                                <Td>
                                    <Button disabled={item.status === 1 ? true :false} style={{backgroundColor:item.status === 1 ? "gray" : "#009879"}} onClick={(event) => {
                                        setInputSchedule({ ...inputSchedule, id: item.id })
                                        setVisible(2);
                                    }} >Sửa</Button>
                                    <Button onClick={(e) => {
                                        const run = async () => {
                                            const res = axios.delete(`/api/admin/schedule/delete/${item.id}`)
                                        }
                                        run();
                                    }}>Xoá</Button>
                                </Td>
                            </tr>
                        ))
                    }
                }
            case 3:
                if (userData) {
                    if (userData.length > 0 && index === 1) {
                        return userData.map((item, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #dddddd" }} onClick={() => {
                                setSelectPation({ ...selectPation, ...item, index: index })
                            }}>
                                <Td>
                                    {index}
                                </Td>
                                <Td>
                                    {item.fullname}
                                </Td>
                                <Td>
                                    {item.age}
                                </Td>
                                <Td>
                                    {item.address}
                                </Td>
                                {/* <Td>
                            <Button>Sửa</Button>
                            <Button>Xoá</Button>
                        </Td> */}

                            </tr>
                        ))
                    }
                    else if (userData[selectPation?.index] && userData[selectPation?.index]?.lstDoctor?.length > 0 && index === 2) {
                        return userData[selectPation?.index].lstManager.map((item, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #dddddd" }}>
                                <Td>
                                    {index}
                                </Td>
                                <Td>
                                    {item.fullname}
                                </Td>
                                <Td>
                                    {item.age}
                                </Td>
                                <Td>
                                    {item.address}
                                </Td>
                                {/* <Td>
                        <Button>Sửa</Button>
                        <Button>Xoá</Button>
                    </Td> */}

                            </tr>
                        ))
                    }
                    else if (maxChart && maxChart?.length > 0 && index === 4) {
                        return maxChart.map((item, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #dddddd" }}>
                                <Td>
                                    {index}
                                </Td>
                                <Td>
                                    {item.id}
                                </Td>
                                <Td>
                                    {item.ir}
                                </Td>
                                <Td>
                                    {item.bpm}
                                </Td>
                                <Td>
                                    {item.spo2}
                                </Td>
                                <Td>
                                    
                                </Td>
                                <Td>
                                    
                                </Td>
                                <Td>
                                    {item.create_at}
                                </Td>
                              
                               
                            </tr>
                        ))
                    }
                    else if (schedule && schedule?.length > 0 && index === 3) {
                        return schedule.map((item, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #dddddd" }}>
                               <Td>
                                    {index}
                                </Td>
                                <Td>
                                    {item.content}
                                </Td>
                                <Td>
                                    {item.id}
                                </Td>
                                
                                <Td>
                                    {item.time}
                                </Td>
                                <Td>
                                    {item.status === 1 ? "Đang chờ lịch" : item.status === 2 ? "Hoàn thành" : "Quá hạn"} 
                                </Td>
                                <Td>
                                    <Button disabled={item.status === 1 ? true :false} style={{backgroundColor:item.status === 1 ?  "gray" : "#009879"}} onClick={(event) => {
                                        setInputSchedule({ ...inputSchedule, id: item.id })
                                        setVisible(2);
                                    }} >Sửa</Button>
                                    <Button onClick={(e) => {
                                        const run = async () => {
                                            const res = axios.delete(`/api/admin/schedule/delete/${item.id}`)
                                        }
                                        run();
                                    }}>Xoá</Button>
                                </Td>
                            </tr>
                        ))
                    }
                }

        }
    }
    return (
        <Container>
            {visible === 1 ?
                <div style={{ backgroundColor: "white", position: "absolute", left: "30%", top: "10%", zIndex: 1, width: "40vw", height: "80vh", overflowY: 'scroll', border: "10px solid white", borderRadius: 30, boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <form style={{ width: "29vw", marginLeft: 5 }}>
                            <div className="form-group">
                                <label >Tên bệnh nhân: </label>
                                <select type="checkbox" className="form-control" name="user_id" onChange={(event) => onChangeHandler(event)} >
                                    <option />
                                    <ListBN data={userData} />
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Thời gian: </label>
                                <input type="datetime-local" className="form-control" name="time" onChange={(event) => onChangeHandler(event)} />
                            </div>
                            <div className="form-group">
                                <label >Trạng thái: </label>
                                <select type="checkbox" className="form-control" name="process" onChange={(event) => onChangeHandler(event)} >
                                    <option />
                                    <ListBN data={[{ id: 0, fullname: "Khẩn cấp" }, { id: 1, fullname: "Chưa đến lịch" }, { id: 2, fullname: "Đã đến lịch" }]} />
                                </select>
                            </div>
                            <div className="form-group">
                                <label >Nội dung: </label>
                                <textarea type="textare" className="form-control" name="content" onChange={(event) => onChangeHandler(event)} >

                                </textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={(event) => onAddHandler(event)}>Xác nhận</button>
                        </form>
                        <i className="fa fa-times-circle" aria-hidden="true" onClick={() => setVisible(0)}></i>

                    </div>
                </div>
                : visible === 2 ?
                    <div style={{ backgroundColor: "white", position: "absolute", left: "30%", top: "10%", zIndex: 1, width: "40vw", height: "80vh", overflowY: 'scroll', border: "10px solid white", borderRadius: 30, boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <form style={{ width: "29vw", marginLeft: 5 }}>

                                <div className="form-group">
                                    <label>Thời gian: </label>
                                    <input type="datetime-local" className="form-control" name="time" onChange={(event) => onChangeHandler(event)} />
                                </div>
                                <div className="form-group">
                                    <label >Nội dung: </label>
                                    <textarea type="textare" className="form-control" name="content" onChange={(event) => onChangeHandler(event)} >

                                    </textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" onClick={(event) => onEditHandler(event)}>Xác nhận</button>
                            </form>
                            <i className="fa fa-times-circle" aria-hidden="true" onClick={() => setVisible(0)}></i>

                        </div>
                    </div>
                    : visible === 3 ?
                        <div style={{ backgroundColor: "white", position: "absolute", left: "20%", top: "10%", zIndex: 1, width: "60vw", height: "80vh", overflowY: 'scroll', border: "10px solid white", borderRadius: 30, boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <form style={{ width: "100%", marginLeft: 5 }}>

                                    <Table style={{ height: "90%",width:"100%" }} >
                                        <thead>
                                            <tr style={{
                                                backgroundColor: "#009879",
                                                color: "#ffffff",
                                                textAlign: "center",
                                            }}>
                                                <Th >ID</Th>
                                                <Th >IR</Th>
                                                <Th >BPM</Th>
                                                <Th >SPo2</Th>
                                                <Th >BPM AVG</Th>
                                                <Th >SPo2 AVG</Th>
                                                <Th >Thời gian</Th>
                                                {/* <Th >Tương Tác</Th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getPationData(4)}
                                        </tbody>
                                    </Table>
                                </form>
                                <i className="fa fa-times-circle" aria-hidden="true" onClick={() => setVisible(0)}></i>

                            </div>
                        </div>
                        : null}
            <Nav style={{ maxHeight: "10%" }}>
                <NavItem>
                    <a style={{ marginLeft: "1.5rem", height: "100%" }}><Img src={Avatar} style={{ height: "100%", objectFit: "cover" }} /></a>
                    <a style={{ marginLeft: "1.5rem" }}><Span>Trang trủ</Span></a>
                    <a style={{ marginLeft: "1.5rem" }}><Span>Dịch vụ</Span></a>
                    <a style={{ marginLeft: "1.5rem" }}><Span>Giới thiệu</Span></a>
                    <a style={{ marginLeft: "1.5rem" }}><Span>Tin tức</Span></a>
                </NavItem>
                <NavItem>
                    <a style={{ marginRight: "1.5rem" }} onClick={(event) => logOutHandler(event)}><Span>Đăng xuất</Span></a>
                </NavItem>
            </Nav>
            {/* HEADER */}

            <Flex style={{ maxHeight: "40%", marginTop: "2.5%" }}>

                <div style={{ width: "60%", height: "90%" }}>
                    <Flex style={{ justifyContent: "space-around" }}>
                        <h3 style={{ height: "10%" }}>Tên Bệnh Nhân: {selectPation?.fullname} </h3>
                        <div >
                            <span>Ngày giờ: </span>
                            <input
                                type="date" onChange={(event) => {
                                    setSelectPation({ ...selectPation, time: event.target.value })

                                }}></input>
                        </div>
                        <h3 style={{ display: "block", backgroundColor: "#009879", marginRight: "12%", padding: "0% 1%", borderRadius: "15%", color: "white" }} onClick={() => {
                            setVisible(3)
                        }}>Chi tiết</h3>

                    </Flex>
                    <LineChart width={window.innerWidth * 0.5} height={window.innerHeight * 0.4} data={maxChart}>
                        <Line type="monotone" dataKey="bmp" stroke="#8884d8" />
                        <Line type="monotone" dataKey="spo2" stroke="black" />
                        <Line type="monotone" dataKey="ir" stroke="yellow" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="created_at" />
                        <YAxis />
                        <Tooltip />
                    </LineChart>
                </div>

                <div style={{ width: "40%", height: "100%" }}>
                    <h3 style={{ height: "10%" }}>{state.UserInfo?.user?.role === 2 ? "Danh sách bệnh nhân:" : state.UserInfo?.user?.role === 3 ? "Danh sách bệnh nhân:" : null} </h3>
                    <Table style={{ height: "90%" }} >
                        <thead>
                            <tr style={{
                                backgroundColor: "#009879",
                                color: "#ffffff",
                                textAlign: "center",
                            }}>
                                <Th >STT</Th>
                                <Th >Tên</Th>
                                <Th >Tuổi</Th>
                                <Th >Địa Chỉ</Th>
                                {/* <Th >Tương Tác</Th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {getPationData(1)}

                        </tbody>
                    </Table>
                </div>
            </Flex>
            {/* END FIRST ROW */}
            <Flex style={{ maxHeight: "40%", marginTop: "2.5%", justifyContent: "space-around" }}>
                <div style={{ width: "50%", height: "100%", marginRight: "10%" }}>
                    <Flex style={{ justifyContent: "space-between" }}>
                        <h3 style={{ height: "10%" }}>Tên Bệnh Nhân: {selectPation?.fullname} </h3>
                        <div >
                            <span>Ngày giờ: </span>
                            {/* <input  type="datetime-local" onChange={(event)=>setSelectPation({...selectPation,time:event.target.value})}></input> */}
                        </div>
                        <h3 style={{ display: "block", backgroundColor: "#009879", padding: "0% 1%", borderRadius: "15%", color: "white" }}>Chi tiết</h3>

                    </Flex>
                    <Table style={{ height: "90%" }} >
                        <thead>
                            <tr style={{
                                backgroundColor: "#009879",
                                color: "#ffffff",
                                textAlign: "center",
                            }}>
                                <Th >STT</Th>
                                <Th >Tên lịch nhắc nhở</Th>
                                <Th >Người đặt</Th>
                                <Th >Thời gian</Th>
                                <Th >Trạng thái</Th>
                                <Th >Hành động</Th>
                                <Th onClick={(event) => addScheduleHandler(event)}>+</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPationData(3)}

                        </tbody>
                    </Table>
                </div>
                <div style={{ width: "40%", height: "100%" }}>
                    <h3 style={{ height: "10%" }}>{state.UserInfo?.user?.role === 2 ? "Danh sách người nhà bệnh nhân:" : state.UserInfo?.user?.role === 3 ? "Danh sách bác sĩ:" : null} </h3>
                    <Table style={{ height: "90%" }} >
                        <thead>
                            <tr style={{
                                backgroundColor: "#009879",
                                color: "#ffffff",
                                textAlign: "center",
                            }}>
                                <Th >STT</Th>
                                <Th >Tên</Th>
                                <Th >Tuổi</Th>
                                <Th >Địa Chỉ</Th>
                                {/* <Th >Tương Tác</Th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {getPationData(2)}

                        </tbody>
                    </Table>
                </div>
            </Flex>
            {/* END 2ND ROW */}



            {/* END MAIN DATA */}
            {/* <hr style={{ marginTop: "5%" }} />
            <Flex style={{position:"absolute",bottom:0,left:0}}>
                <a style={{ marginLeft: "1.5rem" }}><span>Đội Ngũ Y Bác Sĩ</span></a>
                <a style={{ marginLeft: "1.5rem" }}><span>Đội Ngũ Kỹ Thuật Viên</span></a>
                <a style={{ marginLeft: "1.5rem" }}><span>Tin Tức</span></a>
                <a style={{ marginLeft: "1.5rem" }}><span>Bài Viết Bổ Ích</span></a>
                <a style={{ marginLeft: "1.5rem" }}><span>Liên Hệ</span></a>
                <a style={{ marginLeft: "1.5rem" }}><span>Thông Tin</span></a>
            </Flex> */}
            {/* Footer */}
        </Container>
    )
}
// SPEED RUSH MÌ ĂN LIỀN=> CẦN SỬA LẠI KHI CÓ THỜI GIAN