import * as React from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Button, Text, Flex } from 'crox-new-uikit'
import styled from "styled-components"


interface TermModalProps {
  open?: boolean,
  CloseModal?: () => void
}

const TermModal: React.FC<TermModalProps> = ({ open, CloseModal }) => {
  const TermTitle = styled.div`
    font-size: 20px;
    color: white;
    text-align: center;
    font-weight: bold;
  `
  //   const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  //   const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
  //     setOpen(true);
  //     setScroll(scrollType);
  //   };

  const handleClose = () => {
    CloseModal();
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      {/* <Button onClick={handleClickOpen('paper')}>scroll=paper</Button>
      <Button onClick={handleClickOpen('body')}>scroll=body</Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        fullWidth
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="md"
      >
        <DialogContent dividers={scroll === 'paper'} style={{ backgroundColor: "#253253" }}>
          <Text color="white" m="10px" style={{ textAlign: 'center', fontSize: '25px', fontFamily: 'system-ui' }} bold>
            Terms and Conditions
          </Text>
          <Text color="white" mb="10px" style={{ textAlign: 'left', fontSize: '15px' }} bold>
            1. SERVICES
          </Text>
          <Text fontSize="15px" m='10px' color="white" style={{ textAlign: 'left' }} > (a) X-Pad is a decentralized launchpad. Anyone can create a token and clone as existing coins. Token creators can pretend to be owners of the real project. Please use provided social links to research and examine every project to avoid scams.</Text>
          <Text fontSize="15px" m='10px' color="white" style={{ textAlign: 'left' }} > In DeFi project owners can load arbitrary token contracts. Please take extra caution and do your own research when interacting with arbitrary tokens. You might not be able to claim or sell your token when interacting with wrong contracts!</Text>
          <Text fontSize="15px" m='10px' color="white" style={{ textAlign: 'left' }} > Please pay close attention to all token metrics shared on the Project Sale Page. </Text>
          <Text color="white" mb="10px" style={{ textAlign: 'left', fontSize: '15px' }} bold>
            2.YOUR RESPONSIBILITIES
          </Text>
          <Text fontSize="15px" m='10px' color="white" style={{ textAlign: 'left' }} > (a) CroxSwap X-Pad Platform can be utilised by any projects, the access to which is not actively regulated by us, unless strictly specified. We take no responsibility for the X-Pad Projects, their code or their performance.</Text>
          <Text fontSize="15px" m='10px' color="white" style={{ textAlign: 'left' }} > (b) YOU AGREE TO DO THE REQUISITE DUE DILIGENCE BEFORE TAKING PART IN X-PAD ON OUR PLATFORM. WE WILL NOT BE RESPONSIBLE FOR ANY FUNDS LOST.</Text>
          <Text fontSize="15px" m='10px' color="white" style={{ textAlign: 'left' }} > (c) CroxSwap X-Pad Platform can be utilised by any projects, the access to which is not actively regulated by us, unless strictly specified. We take no responsibility for the X-Pad Projects, their code or their performance.</Text>
          <Text as="h3" color="white" mb="10px" style={{ textAlign: 'left', fontSize: '15px' }} bold>
            3. DISCLAIMERS AND WARRANTIES
          </Text>
          <Text fontSize="15px" m='10px' color="white" style={{ textAlign: 'left' }} > (a) CroxSwap does not endorse any X-PAD Project unless explicitly stated. We will not be liable for any loss of funds due to lack of user research in any ICO.
          </Text>
          <Text as="h3" color="white" mb="10px" style={{ textAlign: 'left', fontSize: '15px' }} bold>
            4. Private or Pre-sale commitments are final and non-refundable if the project reaches it&apos;s softcap. Should the soft cap not be reached for the X-Pad,
            contributors are allowed to claim their participation through a withdrawing transaction.
          </Text>
          <Flex justifyContent='center' m='10px'>
            <Button variant='success' onClick={handleClose} style={{ borderRadius: '0', height: '35px' }}>Close</Button>
          </Flex>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TermModal
