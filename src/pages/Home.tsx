import React, { useEffect, useState } from 'react'
import { Jumbotron, Container, Form, Dropdown } from 'react-bootstrap'
import { Checkbox } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import KU_ROUTE from '../assets/icons/KU-ROUTE.png'
import dropdown_arrow from '../assets/icons/dropdownArrow.png'
import 'semantic-ui-css/semantic.min.css'
import Subjects from 'constants/subjects.json'
import { ISubject } from 'interface/subject.interface'
import { Dropdown as SMTDropdown } from 'semantic-ui-react'
import { BsFillCaretDownFill } from 'react-icons/bs'
import { constTags } from 'constants/index'
import { useHistory, useLocation } from 'react-router'
import applicationStore from 'stores/applicationStore'
import TimerIcon from '@mui/icons-material/Timer'
import PersonIcon from '@mui/icons-material/Person'
import '../App.css'
import lineblack from '../assets/icons/lineback.png'
import moreitem from '../assets/icons/more2.png'
import PDF from '../assets/icons/PDF.png'
import JPG from './../assets/icons/JPG.png'
import linewhite from '../assets/icons/line.png'
import profile from '../assets/icons/profile.png'
import { get_allpost } from 'service/system'
import { DocumentData } from '@firebase/firestore'
import { get4File, get_info } from 'service/system'
import '../allPost.css'
import { getDownloadURL } from '@firebase/storage'

function convertTStoDate(timestamp) {
  if (!timestamp) return
  const timeCurrent = new Date().getTime() / 1000
  const timeDiff = timeCurrent - timestamp.seconds

  if (timeDiff < 60) {
    //second
    const second = Math.floor(timeDiff)
    if (second == 1) return second.toString() + ' second ago'
    return second.toString() + ' seconds ago'
  } else if (timeDiff < 3600) {
    //minute
    const minute = Math.floor(timeDiff / 60)
    if (minute == 1) return minute.toString() + ' minute ago'
    return minute.toString() + ' minutes ago'
  } else if (timeDiff < 86400) {
    //hour
    const hour = Math.floor(timeDiff / 3600)
    if (hour == 1) return hour.toString() + ' hour ago'
    return hour.toString() + ' hours ago'
  } else {
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleString().split(',')[0]
  }
}
interface dropdownType {
  text: string
  value: number
}

const HomePage = () => {
  const [fileUrl, setFileUrl] = useState<any>([])
  const [info, setInfo] = useState<DocumentData>([])
  const [statusFilter, setStatusFilter] = useState<any>()
  const [linkFiles, setLinkFiles] = useState<string[]>()

  useEffect(() => {
    const statusFilter = {
      รีวิวรายวิชา: false,
      สรุป: false,
      Lecture: false,
      แบบฝึกหัด: false,
      อื่นๆ: false,
    }
    setStatusFilter(statusFilter)
  }, [])

  const [filter, setFilter] = useState([
    'รีวิวรายวิชา',
    'สรุป',
    'Lecture',
    'แบบฝึกหัด',
    'อื่นๆ',
  ])

  //const [allFilter, setAllFilter] = useState<string[][]>(mockFilter)

  const _subjects: dropdownType[] = (Subjects as ISubject[]).map((s, i) => {
    return {
      text: `${s.subjectCode} ${s.subjectNameTh} (${s.subjectNameEn})`,
      value: i,
      key: i,
    }
  })

  const [subjectSelected, setSubjectSelected] = useState<string>()
  const history = useHistory()

  const [subjects, setSubjects] = useState<dropdownType[]>(
    _subjects.slice(0, 10)
  )

  const goToAllPost = (ID: string, TH: string, ENG: string) => {
    history.push(`/all-post/${ID}+${TH}+${ENG}/page=1`)
  }

  const changeStatus = (TagID: string) => {
    statusFilter[TagID] = !statusFilter[TagID]
    //console.log(statusFilter)
  }

  const onSearchChange = (event: any) => {
    setSubjects(
      _subjects
        .filter((s) =>
          s.text.toLowerCase().includes(event.target.value.toLowerCase())
        )
        .slice(0, 10)
    )
  }

  const handleOnSelectSubject = (event: any) => {
    setSubjectSelected(event.target.innerText)
    //console.log(subjectSelected)
  }

  const handleOnSearch = () => {
    if (!subjectSelected) return
    console.log(subjectSelected)
    const SubjectIDandTH = subjectSelected.split(' ')
    const SubjectENG = subjectSelected.split('(')
    localStorage.setItem('currentSearch', subjectSelected)
    console.log(statusFilter)
    localStorage.setItem('tagSearch', JSON.stringify(statusFilter))
    console.log('Searching... ' + SubjectIDandTH[0])
    goToAllPost(
      SubjectIDandTH[0],
      SubjectIDandTH[1],
      SubjectENG[1].replace(')', '')
    )
  }

  const [allpostData, setallpostData] = useState<DocumentData>([])

  useEffect(() => {
    async function fetch() {
      const allpost = (await get_allpost()) as DocumentData
      const fileUrl = await Promise.all(
        allpost.map((Post) => get4File(Post[0]))
      )
      const infoo = await Promise.all(
        allpost.map((Post) => get_info(Post[1]?.AccountID))
      )

      setallpostData(allpost)
      setFileUrl(fileUrl)
      setInfo(infoo)
    }
    fetch()
  }, [])

  // console.log(allpostData)
  // console.log(fileUrl)

  function renderPost(menu, index, col, file, info) {
    const PostID = menu[0]
    countPostColumn[col]++

    if (countPostColumn[col] % 2 == col) {
      return (
        <div
          className="w-content d-flex mb-5"
          key={index}
          //  onMouseEnter={"d"}
          //  onMouseLeave={}
        >
          <Container className="w-content d-inline-block p-0 zoom-1 hover-brighten">
            <div className="row m-0 p-0 d-inline w-25">
              <div
                className="form py-4 cursor-pointer"
                onClick={() => handleOnViewPage(PostID)}
              >
                <div className="row ml-1">
                  <tr className="TAG d-block w-content my-1 mx-2 mb-3">
                    {menu[1].TagID.map((tag, idx) => (
                      <div
                        className="hover-darken-2 max-w-content d-inline-block rounded cursor-pointer px-2 py-1 ml-3 mb-2"
                        key={tag}
                        style={{
                          backgroundColor:
                            colors[maxColor - (idx % maxColor) - 1],
                          color: '#FFFFFF',
                        }}
                      >
                        {tag}
                      </div>
                    ))}
                    {/* <th className="category">{menu.Category}</th> */}
                  </tr>
                </div>

                <div className="title text-truncate mx-3 px-2 mt-1 my-2">
                  {menu[1].Title}
                </div>
                <div className="row ml-2">
                  <div className="texttitle col-8 ">{menu[1].SubjectENG}</div>
                  <div className="texttitle col-3 ">{menu[1].SubjectID}</div>
                </div>
                <div className="mx-3 px-2 mb-2">
                  <img className="line-black w-100" src={lineblack} />
                </div>
                <div
                  className="headtext text-truncate mx-3 mt-1 px-2 my-2"
                  style={{ height: '41px' }}
                >
                  {menu[1].Description}
                  <p
                    className="font-weight-bold cursor-pointer"
                    onClick={() => handleOnViewPage(PostID)}
                  >
                    {menu[1].Description.length > 40 ? 'ดูเพิ่มเติม...' : null}
                  </p>
                </div>

                <div className="pdfrow mx-3 px-2 mb-2 pb-2">
                  <div className="d-flex align-content-start flex-wrap">
                    {file &&
                      file.map((file, index) => {
                        if (index == 3) return
                        const fileSP = file[1].name.split('.')
                        const extFile =
                          fileSP[fileSP.length - 1] == 'pdf' ? PDF : JPG
                        return (
                          <a
                            className=""
                            key={file[1].name}
                            href={file[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img className="pdf d-inline-block" src={extFile} />
                            <div
                              className="text-center text-truncate mr-1 textmore"
                              style={{ maxWidth: '55px' }}
                            >
                              {file[1].name}
                            </div>
                          </a>
                        )
                      })}
                    {file && file.length > 3 && (
                      <a
                        className="pdfcount cursor-pointer d-inline-block"
                        //onClick={() => handleOnViewPage(PostID)}
                      >
                        <img className="moreItem" src={moreitem} />
                        <div className="textmore">ดูเพิ่มเติม</div>
                      </a>
                    )}
                  </div>
                </div>

                {/* <tr className="d-block">
                  <th className="creatby">
                      <img className="Profile" src={profile} />
                      <span className="Name">{menu.create}</span>
                    </th>
                  <div 
                    className="aqualine mx-3 mt-4 mb-2"
                    style={{
                      background: "#3fd0c9",
                      height: "2px"  
                    }}
                    >
                  </div>
                </tr> */}
              </div>
            </div>
            <div
              className="mx-3 px-2 d-flex justify-content-between"
              style={{ marginTop: '-32px' }}
            >
              <div className="Time text-truncate" style={{ maxWidth: '150px' }}>
                <PersonIcon style={{ marginTop: '-5px' }} />
                {' ' + info?.DisplayName}
              </div>
              <div className="Time">
                <TimerIcon style={{ marginTop: '-5px' }} />
                {' Posted ' + convertTStoDate(menu[1].DateEdited)}
              </div>
            </div>
          </Container>
        </div>
      )
    }
  }

  // var expanded = false;

  // function showCheckboxes() {
  //   var checkboxes = document.getElementById("checkboxes");
  //   if (!expanded) {
  //     checkboxes.style.display = "block";
  //     expanded = true;
  //   } else {
  //     checkboxes.style.display = "none";
  //     expanded = false;
  //   }
  // }

  const [dropdown, setDropdrown] = useState(false)

  //
  const colors = [
    '#5697C4',
    '#E0598B',
    '#E278A3',
    '#9163B6',
    '#993767',
    '#A34974',
    '#BE5168',
    '#C84A52',
    '#E16452',
    '#F19670',
    '#E9D78E',
    '#E4BE7F',
    '#74C493',
  ]
  const maxColor = colors.length
  let countPostColumn = [-1, -1]

  const handleOnViewPage = (PostID: string) => {
    history.push(`post/${PostID}`)
  }

  //

  return (
    <Jumbotron className="blue-bg jumbotron jumbotron-fluid mb-0">
      <Container className="px-5 pt-0 mt-0 text-center mb-5">
        <img
          src={KU_ROUTE}
          className="mx-auto d-block mb-2"
          width="230px"
          height="38px"
          alt="KU_ROUTE"
        />
        {/* <div
          style={{
            width: '462px',
            height: '122px',
            left: '489px',
            top: '303px',
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '72px',
            lineHeight: '84px',
            display: 'flex',
            // aligntems: 'center',
            // text-align: 'center',
            color: '#02353C',
          }}
        >
          KU-ROUTE  
        </div> */}
        <p
          className="mb-2"
          style={{ color: '#137D54', fontWeight: 'bold', fontSize: '25px' }}
        >
          {' '}
          ค้นหาชื่อวิชา / รหัสวิชาที่อยากรู้
        </p>
        <div className="d-flex justify-content-center">
          <Form className="w-75">
            <div className="form-group shadow d-flex w-100 rounded-lg">
              <SMTDropdown
                id="home-search-block"
                fluid
                search
                selection
                options={subjects.slice(0, 10)}
                onChange={handleOnSelectSubject}
                onSearchChange={onSearchChange}
                //onKeyPress={handleOnSearch}
                type="text"
                className="form-control text-black d-flex border-0 pr-3"
                style={{
                  borderRadius: '5px 0rem 0rem 5px',
                  border: 'none',
                  color: 'black',
                }}
                icon={
                  <div className="ml-auto">
                    <BsFillCaretDownFill />
                  </div>
                }
                placeholder="พิมพ์ชื่อวิชา / รหัสวิชา..."
              />
              <Dropdown show={dropdown}>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-autoclose-outside"
                  className="h-100"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: 'none',
                    borderRadius: '0rem 5px 5px 0rem',
                  }}
                >
                  <div onClick={() => setDropdrown(!dropdown)}>
                    <img
                      src={dropdown_arrow}
                      className="p-1"
                      width="18px"
                      height="14px"
                    />
                  </div>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      style={{
                        color: '#02353C',
                        fontWeight: 'bold',
                        fontSize: '12px',
                      }}
                    >
                      FILTER BY
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{ color: '#02353C', fontSize: '11px' }}
                    >
                      ประเภท
                    </Dropdown.Item>
                    {filter.map((filter) => (
                      <Dropdown.Item
                        href="#/action-3"
                        style={{ color: '#02353C', fontSize: '11px' }}
                      >
                        <form>
                          <input
                            type="checkbox"
                            className="checkbox-round"
                            style={{
                              boxSizing: 'border-box',
                            }}
                            onClick={() => changeStatus(filter)}
                          />
                          <label>&nbsp;&nbsp;{filter}</label>
                        </form>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            <br />
            <button
              type="submit"
              className="btn btn-primary btn-sm px-3 py-2 mt-2 rounded-lg"
              style={{ backgroundColor: '#02353C', borderWidth: '0px' }}
              onClick={handleOnSearch}
            >
              SEARCH
            </button>
          </Form>
        </div>
      </Container>

      {/* Post */}
      <div className="d-inline-block justify-content-center d-flex">
        <div>
          <thead>
            <div
              className="Subject d-inline-block m-0 p-0"
              style={{ width: '65%', maxWidth: '700px' }}
            >
              <div className="SubjectENG max-w-content">โพสต์ล่าสุด</div>
            </div>
            <img className="line-white d-block mt-2" src={linewhite} />
          </thead>

          <div className="my-5 d-block"></div>
          <div>
            <div className="w-content d-flex justify-content-between">
              <div
                className="left w-content d-inline-block pt-3 ml-4"
                style={{ verticalAlign: 'top' }}
              >
                {allpostData &&
                  fileUrl &&
                  info &&
                  allpostData.length == fileUrl.length &&
                  allpostData.length == info.length &&
                  allpostData
                    .slice(0, 6)
                    ?.map((menu, index) =>
                      renderPost(menu, index, 0, fileUrl[index], info[index])
                    )}
              </div>

              <div
                className="right w-content d-inline-block pt-3 mr-4"
                style={{ verticalAlign: 'top' }}
              >
                {allpostData &&
                  fileUrl &&
                  info &&
                  allpostData.length == fileUrl.length &&
                  allpostData.length == info.length &&
                  allpostData
                    .slice(0, 6)
                    ?.map((menu, index) =>
                      renderPost(menu, index, 1, fileUrl[index], info[index])
                    )}
              </div>
            </div>
          </div>
        </div>
        {console.log(info)}
      </div>
    </Jumbotron>
    // {/* <div>
    //   HomePage
    //   <br />
    //   <Link to="/">Home</Link>
    //   <br />
    //   <Link to="/signin">sign</Link>
    //   <br />
    //   <Link to="/post">post</Link>
    //   <br />
    //   <Link to="/create-post">create-post</Link>
    //   <br />
    //   <br />
    //   <Link to="/all-post">all-post</Link>
    //   <br />
    // </div> */}
  )
}

export default HomePage
