/*
 * SonarQube
 * Copyright (C) 2009-2019 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

declare namespace T {
  export type BranchType = 'LONG' | 'SHORT';

  export interface Branch {
    analysisDate?: string;
    excludedFromPurge: boolean;
    isMain: boolean;
    name: string;
    status?: { qualityGateStatus: Status };
  }

  export interface MainBranch extends Branch {
    isMain: true;
  }

  export interface LongLivingBranch extends Branch {
    isMain: false;
    type: 'LONG';
  }

  export interface ShortLivingBranch extends Branch {
    isMain: false;
    isOrphan?: true;
    mergeBranch: string;
    type: 'SHORT';
  }

  export interface PullRequest {
    analysisDate?: string;
    base: string;
    branch: string;
    key: string;
    isOrphan?: true;
    status?: { qualityGateStatus: Status };
    target: string;
    title: string;
    url?: string;
  }

  export type BranchLike = Branch | PullRequest;

  export interface BranchTree {
    branch: Branch;
    pullRequests: PullRequest[];
  }

  export interface BranchLikeTree {
    mainBranchTree?: BranchTree;
    branchTree: BranchTree[];
    parentlessPullRequests: PullRequest[];
    orphanPullRequests: PullRequest[];
  }

  export type BranchParameters = { branch?: string } | { pullRequest?: string };

  export interface BranchWithNewCodePeriod extends Branch {
    newCodePeriod?: NewCodePeriod;
  }
}