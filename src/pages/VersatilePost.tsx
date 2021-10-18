import { useState, useEffect } from 'react'
import { Button, Dropdown, FormControl, InputGroup } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router'
import { generateRandomColor, removeElementFromArray } from 'utils'
import { BsFillCaretDownFill } from 'react-icons/bs'
import { Dropdown as SMTDropdown } from 'semantic-ui-react'
import DropFileZone from 'components/DropFileZone'
import applicationStore from 'stores/applicationStore'
import { observer } from 'mobx-react-lite'
import { IFileWithMeta, StatusValue } from 'react-dropzone-uploader'
import { create_post } from 'service/user'
import { delete_post } from 'service/system'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import { ISubject } from 'interface/subject.interface'
import { constTags } from 'constants/index'
import Subjects from 'constants/subjects.json'
import { get_one_post, get_file, delete_file } from 'service/system'
import { edit, editPost } from 'service/user'
import { DocumentData, serverTimestamp } from '@firebase/firestore'
import { getDownloadURL, StorageReference } from '@firebase/storage'
import pdf from './../assets/icons/PDF.png'
import jpg from './../assets/icons/JPG.png'
import CloseLabel from '@material-ui/icons/Close'

const pathType = { '/create-post': true, '/edit-post': false }

interface dropdownType {
  text: string
  value: string
}

const VersatilePost = observer(() => {
  const [postInfo, setPostInfo] = useState<DocumentData>([])
  const [allFiles, setAllFiles] = useState<StorageReference[]>()
  const [linkFiles, setLinkFiles] = useState<string[]>()
  const [deletedFile, setDeletedFile] = useState<string[]>([])

  const { pathname } = useLocation()
  const isNewPost = pathType[pathname]
  const PostID = pathname.split('/')[2]
  useEffect(() => {
    async function fetch() {
      if (!PostID) return
      const post = (await get_one_post(PostID)) as DocumentData
      const files = (await get_file(PostID)) as StorageReference[]
      const fileUrl = await Promise.all(
        files.map((file) => getDownloadURL(file))
      )

      setAllFiles(files)
      setLinkFiles(fileUrl)
      setPostInfo(post)
      onFileChange('done', [])
    }
    fetch()
  }, [PostID])

  // if(allFiles){
  //   console.log(allFiles[0].fullPath)
  //   // delete_file(allFiles[0].fullPath)
  // }

  const _subjects: dropdownType[] = (Subjects as ISubject[]).map((s, i) => {
    return {
      text: `${s.subjectCode} ${s.subjectNameTh} (${s.subjectNameEn})`,
      value: s.subjectCode,
      key: i,
    }
  })
  const preprocessTags = generateRandomColor(
    constTags.map((text) => {
      return { text }
    })
  )

  const [subjects, setSubjects] = useState<dropdownType[]>(
    _subjects.slice(0, 10)
  )

  const [topicSelected, setTopicSelected] = useState<string>()
  const [unselectedTagCount, setUnselectedTagCount] = useState(0)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [tags, setTags] = useState<{ [name: string]: string }[]>(preprocessTags)
  const [tagsSelected, setTagSelected] = useState<string[]>([])
  const [filesUpload, setFilesUpload] = useState<{
    status: StatusValue
    allFiles: IFileWithMeta[]
  }>({ status: 'started', allFiles: [] })

  useEffect(() => {
    if (isNewPost || !postInfo[1]) return
    const includingSubject = _subjects.find(
      (s) => s.value === postInfo[1].SubjectID
    )
    if (includingSubject) setSubjects([...subjects, includingSubject])
    setTopicSelected(
      postInfo[1]?.SubjectID +
        ' ' +
        postInfo[1]?.SubjectTH +
        ' (' +
        postInfo[1]?.SubjectENG +
        ')'
    )
    setTitle(postInfo[1]?.Title)
    setTagSelected(postInfo[1]?.TagID)
    setDescription(postInfo[1]?.Description)
    setUnselectedTagCount(postInfo[1]?.TagID.length)
  }, [isNewPost, postInfo])

  const history = useHistory()
  const goToMyPost = () => {
    history.push('/my-post')
  }

  const handleOnTagChange = (value: string, event: 'add' | 'remove') => {
    if (event === 'add') {
      setTagSelected([...tagsSelected, value])
      setUnselectedTagCount(unselectedTagCount + 1)
    } else {
      setTagSelected(removeElementFromArray(tagsSelected, value))
      setUnselectedTagCount(unselectedTagCount - 1)
    }
  }

  const handleOnSelectSubject = (event: any) => {
    console.log(event.target.innerText.split(' ')[0])
    setTopicSelected(event.target.innerText)
  }

  const onFileChange = (status: StatusValue, allFiles: IFileWithMeta[]) => {
    console.log(filesUpload.status)
    setFilesUpload({ status, allFiles })
  }

  const onSearchChange = (event: any) => {
    setSubjects(
      _subjects.filter((s) =>
        s.text.toLowerCase().includes(event.target.value.toLowerCase())
      )
    )
  }

  const handelOnCreatePost = async () => {
    console.log(topicSelected, filesUpload.status, applicationStore.user)
    if (
      !topicSelected ||
      filesUpload.status !== 'done' ||
      !applicationStore.user
    )
      return
    // create_post
    await create_post(
      {
        AccountID: applicationStore.user.uid,
        TagID: tagsSelected,
        SubjectID: topicSelected.split(' ')[0],
        SubjectTH: topicSelected.split(' ')[1],
        SubjectENG: topicSelected.split('(')[1].replace(')', ''),
        Title: title,
        Description: description,
      },
      filesUpload.allFiles,
      goToMyPost
    )
  }

  const handleOnDeletePost = () => {
    // delete_post()
  }

  const handelOnEditPost = async () => {
    // console.log('test edit')
    if (
      !topicSelected ||
      filesUpload.status !== 'done' ||
      !applicationStore.user
    )
      return

    // edit_post
    await editPost(
      {
        AccountID: applicationStore.user.uid,
        TagID: tagsSelected,
        SubjectID: topicSelected.split(' ')[0],
        SubjectTH: topicSelected.split(' ')[1],
        SubjectENG: topicSelected.split('(')[1].replace(')', ''),
        Title: title,
        Description: description,
        DateEdited: serverTimestamp(),
      },
      postInfo[0],
      filesUpload.allFiles,
      goToMyPost
    )
    //delete file when publish(edit)
    deletedFile?.map((file) => {
      delete_file(file)
    })
  }

  const handelOnDeletedFile = async (filepath: any) => {
    console.log('path: ' + filepath)
    if (!deletedFile.includes(filepath)) {
      setDeletedFile([...deletedFile, filepath])
    } else {
      setDeletedFile(deletedFile.filter((item) => item !== filepath))
    }
    console.log(deletedFile)
  }

  const fileStatus = () => {
    // specific for this case
    // if final result  file is 0 -> red, else if done or removed -> green, eise if uploading -> green
    return (allFiles?.length ? allFiles?.length : 0) -
      deletedFile.length +
      filesUpload.allFiles.length
      ? filesUpload.status != 'uploading'
        ? filesUpload.status == 'done' || filesUpload.status == 'removed'
          ? '#007bff'
          : '#ffc107'
        : '#ffc107'
      : '#FF5A5A'
  }

  return (
    <div className="white-bg py-5">
      <h2 className="font-weight-bold text-center mb-5">
        {isNewPost ? 'สร้างโพสต์' : 'แก้ไขโพสต์'}
      </h2>

      <div
        className="rounded-25 shadow mx-auto mb-4"
        style={{ maxWidth: '70rem' }}
      >
        {/* {console.log(topicSelected === postInfo[1]?.SubjectID)} */}
        <SMTDropdown
          placeholder={isNewPost ? 'กรุณาเลือกวิชา' : topicSelected}
          // value={topicSelected}
          fluid
          search
          selection
          options={subjects.slice(0, 10)}
          onChange={handleOnSelectSubject}
          onSearchChange={onSearchChange}
          // searchQuery={searchQuery}
          className="rounded-10 bg-primary-dark text-white font-weight-bold d-flex"
          icon={
            <div className="ml-auto">
              <BsFillCaretDownFill />
            </div>
          }
        />
      </div>
      <div
        className="bg-secondary p-5 rounded-25 shadow mx-auto mb-4"
        style={{ maxWidth: '70rem' }}
      >
        {/* <div className="bg-secondary p-4" style={{borderRadius: '20px'}}> */}
        <p className="font-weight-bold">หัวเรื่อง</p>
        <InputGroup className="rounded-10 bg-white mb-4">
          <FormControl
            value={title}
            aria-label="title"
            className="rounded-10 border-0"
            placeholder="หัวข้อโพสต์..."
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
          />
          <div
            style={{
              position: 'absolute',
              top: -25,
              right: 0,
              fontSize: 14,
              opacity: 0.5,
            }}
          >
            {title?.length}/50
          </div>
        </InputGroup>

        <p className="font-weight-bold">ข้อความ</p>
        <InputGroup>
          <FormControl
            value={description}
            as="textarea"
            rows={8}
            className="rounded-10 border-0 mb-4"
            style={{ minHeight: '15rem' }}
            placeholder="รายละเอียดเกี่ยวกับโพสต์..."
            onChange={(e) => setDescription(e.target.value)}
            maxLength={9999}
          />
          <div
            style={{
              position: 'absolute',
              top: -25,
              right: 0,
              fontSize: 14,
              opacity: 0.5,
            }}
          >
            {description?.length}/9999
          </div>
        </InputGroup>

        <p className="font-weight-bold">Tag</p>
        <div className="d-flex">
          {tagsSelected.map((tag, idx) => (
            <div
              className="max-w-content px-2 rounded cursor-pointer align-self-center px-2 py-1 mr-2"
              key={tag}
              onClick={() => handleOnTagChange(tag, 'remove')}
              style={{
                backgroundColor: tags.find((t) => t.text === tag)?.color,
              }}
            >
              {tag}
            </div>
          ))}
          <Dropdown className="rounded">
            <Dropdown.Toggle
              id="dropdown-custom-components"
              className="px-2 py-1 rounded border-0"
              hidden={unselectedTagCount != tags?.length ? false : true}
            >
              + เพิ่ม
            </Dropdown.Toggle>

            <Dropdown.Menu className="px-2 py-0">
              {tags
                .filter((tag) => !tagsSelected.includes(tag.text))
                .map((tag, idx) => (
                  <Dropdown.Item
                    eventKey={idx}
                    style={{ backgroundColor: tag.color }}
                    className="rounded my-2"
                    onClick={() => handleOnTagChange(tag.text, 'add')}
                    key={tag.text}
                  >
                    {tag.text}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div
        className="bg-secondary p-5 rounded-25 shadow mx-auto mb-4"
        style={{ maxWidth: '70rem' }}
      >
        <h5 className="font-weight-bold mb-3">แนบไฟล์เพิ่มเติม</h5>
        <div className="max-w-content d-flex align-items-center flex-wrap">
          {allFiles &&
            linkFiles &&
            allFiles.map((file, index) => {
              const fileSP = file.name.split('.')
              const extFile = fileSP[fileSP.length - 1]

              return (
                <div
                  className="d-flex flex-column mr-4 mb-4"
                  style={{
                    opacity: deletedFile?.includes(allFiles[index]?.fullPath)
                      ? 0.5
                      : 1,
                  }}
                >
                  {/* {console.log(
                    deletedFile?.includes(allFiles[index]?.fullPath)
                  )} */}
                  <a
                    className="style13 cursor-pointer hover-darken"
                    key={file.name}
                    href={linkFiles[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="style14 d-flex flex-column pb-3">
                      <div className="d-block mx-auto">
                        <img
                          src={extFile == 'pdf' ? pdf : jpg}
                          style={{ width: '125px', height: '125px' }}
                        />
                      </div>
                      <div className="style15 d-block mx-auto mb-0">
                        <div
                          className="text-truncate mb-3 px-3"
                          style={{ maxWidth: '130px' }}
                        >
                          {fileSP[0]}
                        </div>
                        .{extFile.toUpperCase()}
                      </div>
                    </div>
                  </a>
                  <Button
                    className="p-0 m-0 bg-danger border-0"
                    onClick={() =>
                      handelOnDeletedFile(allFiles[index]?.fullPath)
                    }
                    // style={{
                    //   zIndex: 100,
                    //   position: 'absolute',
                    //   left: '100px',
                    //   top: '5px',
                    // }}
                  >
                    <CloseLabel />
                  </Button>
                </div>
              )
            })}
        </div>
        <DropFileZone onChange={onFileChange} />
        <p
          className={
            'style13 w-100 px-3 py-1 text-center mt-4 rounded-lg shadow-sm text-white'
          }
          style={{
            fontSize: '18px',
            backgroundColor: fileStatus(),
            borderColor: fileStatus(),
          }}
        >
          {fileStatus() != '#FF5A5A'
            ? fileStatus() != '#ffc107'
              ? 'File ready !'
              : 'Waiting...'
            : 'Choose file to publish'}
        </p>
      </div>

      <div className="mx-auto my-5" style={{ maxWidth: '70rem' }}>
        <div className="d-flex justify-content-center">
          {!isNewPost && (
            <Button
              className="pl-1"
              variant="danger"
              style={{ width: '7rem' }}
              onClick={handleOnDeletePost}
            >
              <DeleteIcon className="mr-1 ml-0" />
              DELETE
            </Button>
          )}
          <div className="mx-2" />
          <Button
            className="pl-1"
            style={{ width: '7rem' }}
            onClick={isNewPost ? handelOnCreatePost : handelOnEditPost}
            disabled={
              (filesUpload.allFiles.length > 0 && fileStatus() != '#007bff') ||
              tagsSelected.length == 0 ||
              !topicSelected ||
              !title
            }
          >
            <FileUploadIcon className="mr-1 ml-1" />
            PUBLISH
          </Button>
        </div>
      </div>
    </div>
  )
})

export default VersatilePost
