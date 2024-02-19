#!/usr/bin/env node
import 'source-map-support/register';
import { App, Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import { CdkDemoStack } from '../lib/stacks/cdk-demo-stack';
import { StepBatchStack } from '../lib/stacks/step-batch-stack';
import { DisasterRecoveryStack } from '../lib/stacks/disaster-recovery-stack';

const app = new App();

Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

new CdkDemoStack(app, 'CdkDemoStack');
const stepBatchStack = new StepBatchStack(app, 'StepBatchStack');

NagSuppressions.addStackSuppressions(stepBatchStack, [
  {
    id: "AwsSolutions-S1",
    reason: "overkill for this small sample",
  },
  {
    id: "AwsSolutions-IAM4",
    reason: "Managed policies are sufficient for a sample of this size",
  },
  {
    id: "AwsSolutions-IAM5",
    reason: "Some dynamic wildcard permissions are required for several service actions",
  },
]);

const disasterRecoveryStack = new DisasterRecoveryStack(app, 'DisasterRecoveryStack');

const globalSuppressionReasons = {
  'AwsSolutions-IAM4': 'Using AWS managed policy for basic Lambda execution role',
  'AwsSolutions-IAM5': 'Some dynamic wildcard permissions are required for several service actions',
  'AwsSolutions-L1': 'Latest runtime version is used where possible; exceptions are documented'
};

// DisasterRecoveryStack specific suppressions
const disasterRecoverySuppressionPaths = [
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/OnEventHandler/ServiceRole/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/OnEventHandler/ServiceRole/DefaultPolicy/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/OnEventHandler/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/IsCompleteHandler/ServiceRole/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/IsCompleteHandler/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/Provider/framework-onEvent/ServiceRole/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/Provider/framework-onEvent/ServiceRole/DefaultPolicy/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/Provider/framework-onEvent/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/Provider/framework-isComplete/ServiceRole/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/Provider/framework-isComplete/ServiceRole/DefaultPolicy/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/Provider/framework-isComplete/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/Provider/framework-onTimeout/ServiceRole/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/Provider/framework-onTimeout/ServiceRole/DefaultPolicy/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/Provider/framework-onTimeout/Resource',
  '/DisasterRecoveryStack/@aws-cdk--aws-dynamodb.ReplicaProvider/Provider/waiter-state-machine/Role/DefaultPolicy/Resource',
  '/DisasterRecoveryStack/Product/SourceTableAttachedManagedPolicy-DisasterRecoveryStackawscdkawsdynamodbReplicaProviderOnEventHandlerServiceRoleAA3E8467/Resource/Resource',
  '/DisasterRecoveryStack/BackupPlan/BackupSelection/Role/Resource',
  '/DisasterRecoveryStack/ProductLambda/ServiceRole/Resource',
];

disasterRecoverySuppressionPaths.forEach(path => {
  Object.entries(globalSuppressionReasons).forEach(([id, reason]) => {
    NagSuppressions.addResourceSuppressionsByPath(disasterRecoveryStack, path, [{ id, reason }]);
  });
});

// API Gateway related suppressions
const apiGatewaySuppressions = {
  'AwsSolutions-APIG2': 'Request validation is handled in the application code.',
  'AwsSolutions-APIG1': 'Access logging is not required for this stage of development.',
  'AwsSolutions-APIG3': 'WAFv2 integration is planned for a future stage.',
  'AwsSolutions-APIG6': 'CloudWatch logging will be enabled post-development phase.',
  'AwsSolutions-APIG4': 'Authorization will be implemented in the next phase of development.',
  'AwsSolutions-COG4': 'Cognito User Pools integration is planned for a future stage.'
};

const apiGatewayResourcePaths = [
  '/DisasterRecoveryStack/Product-Lambda-API/Resource',
  '/DisasterRecoveryStack/Product-Lambda-API/DeploymentStage.prod/Resource',
  '/DisasterRecoveryStack/Product-Lambda-API/Default/addProduct/POST/Resource',
  '/DisasterRecoveryStack/Product-Lambda-API/Default/getProduct/GET/Resource',
  '/DisasterRecoveryStack/Product-Lambda-API/Default/getProducts/GET/Resource',
  '/DisasterRecoveryStack/Product-Lambda-API/Default/updateProduct/PUT/Resource',
  '/DisasterRecoveryStack/Product-Lambda-API/Default/deleteProduct/DELETE/Resource'
];

apiGatewayResourcePaths.forEach(path => {
  Object.entries(apiGatewaySuppressions).forEach(([id, reason]) => {
    NagSuppressions.addResourceSuppressionsByPath(disasterRecoveryStack, path, [{ id, reason }]);
  });
});

app.synth();