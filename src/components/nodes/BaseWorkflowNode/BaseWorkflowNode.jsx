import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import BaseWorkflowNodeHeader from './BaseWorkflowNodeHeader';
import BaseWorkflowNodeBody from './BaseWorkflowNodeBody';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';
import ProblemPopover from '../../problemPopover/ProblemPopover';
import { useStatusStore } from '../../../store/status.store';

const useStyles = makeStyles(() => ({
  container: {
    border: '2px solid #434343',
  },
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)',
  },
}));

const BaseWorkflowNode = ({ children, node, storeId }) => {
  const classes = useStyles();
  const shouldShowInvalidNodes = useStatusStore(state => state.shouldShowInvalidNodes);
  const problematicNode = useStatusStore(state => state.problematicNodes.find(pN => pN.id === node.id));

  return (
    <ExtendedNodeContainer node={node} storeId={storeId}>
      <Paper className={classes.container} elevation={4}>
        <div className={node.isSelected ? classes.selected : ''}>
          <BaseWorkflowNodeHeader node={node} storeId={storeId} />
          <BaseWorkflowNodeBody node={node} storeId={storeId} />
        </div>
        {shouldShowInvalidNodes && problematicNode && <ProblemPopover status={problematicNode.status} message={problematicNode.message} />}
      </Paper>
    </ExtendedNodeContainer>
  );
};

export default React.memo(BaseWorkflowNode);
