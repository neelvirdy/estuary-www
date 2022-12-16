import styles from '@components/PinStatusIcon.module.scss';
import { BalanceOutlined, GppGoodOutlined, LinkOutlined, PhotoSizeSelectSmallOutlined, SafetyCheckOutlined, UploadOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

function DealStatusIcon(props: any) {
  if (props.dealStatus == 'staged') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <PhotoSizeSelectSmallOutlined color="disabled" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'asking') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <BalanceOutlined color="action" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'transfering') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <UploadOutlined color="primary" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'on-chain') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <LinkOutlined color="secondary" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'sealed') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <GppGoodOutlined color="success" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'repairing') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <SafetyCheckOutlined color="warning" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  }
  return null;
}

export default DealStatusIcon;
