import { observer } from 'mobx-react'
import { useEffect, useState, ReactElement } from 'react'
import { Button, Modal, Dropdown } from 'semantic-ui-react'
import applicationStore from 'stores/applicationStore'
import { disable } from 'service/user'
import 'bootstrap/dist/css/bootstrap.min.css'
import logo_delete from '../assets/icons/Vector.png'

interface postProps {
  onClick: (PostID: string) => void
  PostID: string
}

const ModalFavouriteMenu = observer(({ PostID, onClick }: postProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleOnDelete = async () => {
    if (!applicationStore.user) return
    await disable(
      {},
      'Like:' + applicationStore.user.uid + '_' + PostID,
      'Like'
    )
    setOpen(false)
    onClick(PostID)
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={
        <div className="removebutton max-w-content d-inline-block cursor-pointer">
          REMOVE
        </div>
      }
      open={open}
      size="tiny"
      dimmer="inverted"
      className="h-auto"
    >
      <Modal.Header>Unlike Post</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p style={{ fontSize: '16px' }}>คุณต้องการยกเลิกถูกใจโพสต์นี้ ?</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          ยกเลิก
        </Button>
        <Button onClick={() => handleOnDelete()} negative>
          ตกลง
        </Button>
      </Modal.Actions>
    </Modal>
  )
})

const ModalEditPostMenu = observer(({ PostID, onClick }: postProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleOnDelete = async () => {
    if (!applicationStore.user) return
    await disable({}, PostID, 'Post')
    setOpen(false)
    onClick(PostID)
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={
        <div className="removebutton max-w-content d-inline-block cursor-pointer hover-darken">
          REMOVE
        </div>
      }
      open={open}
      size="tiny"
      dimmer="inverted"
      className="h-auto"
    >
      <Modal.Header>Delete Post</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p style={{ fontSize: '16px' }}>คุณต้องการลบโพสต์นี้ ?</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          ยกเลิก
        </Button>
        <Button onClick={() => handleOnDelete()} negative>
          ตกลง
        </Button>
      </Modal.Actions>
    </Modal>
  )
})

export { ModalFavouriteMenu, ModalEditPostMenu }
