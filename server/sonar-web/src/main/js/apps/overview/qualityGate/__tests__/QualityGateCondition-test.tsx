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
import { shallow } from 'enzyme';
import * as React from 'react';
import QualityGateCondition from '../QualityGateCondition';

const mockRatingCondition = (metric: string): T.QualityGateStatusConditionEnhanced => ({
  error: '1',
  level: 'ERROR',
  measure: {
    metric: {
      id: '100',
      key: metric,
      type: 'RATING',
      name: metric
    },
    value: '3'
  },
  op: 'GT',
  metric
});

const periods = [{ value: '3', index: 1 }];

it('open_issues', () => {
  const condition: T.QualityGateStatusConditionEnhanced = {
    error: '0',
    level: 'ERROR',
    measure: {
      metric: {
        id: '1',
        key: 'open_issues',
        type: 'INT',
        name: 'Open open_issues'
      },
      value: '10'
    },
    metric: 'open_issues',
    op: 'GT'
  };
  expect(
    shallow(<QualityGateCondition component={{ key: 'abcd-key' }} condition={condition} />)
  ).toMatchSnapshot();
});

it('new_open_issues', () => {
  const condition: T.QualityGateStatusConditionEnhanced = {
    error: '0',
    level: 'ERROR',
    measure: {
      metric: {
        id: '1',
        key: 'new_open_issues',
        type: 'INT',
        name: 'new_open_issues'
      },
      periods: [{ value: '10', index: 1 }],
      value: '10'
    },
    metric: 'new_open_issues',
    op: 'GT',
    period: 1
  };
  expect(
    shallow(<QualityGateCondition component={{ key: 'abcd-key' }} condition={condition} />)
  ).toMatchSnapshot();
});

it('reliability_rating', () => {
  const condition = mockRatingCondition('reliability_rating');
  expect(
    shallow(<QualityGateCondition component={{ key: 'abcd-key' }} condition={condition} />)
  ).toMatchSnapshot();
});

it('security_rating', () => {
  const condition = mockRatingCondition('security_rating');
  expect(
    shallow(<QualityGateCondition component={{ key: 'abcd-key' }} condition={condition} />)
  ).toMatchSnapshot();
});

it('sqale_rating', () => {
  const condition = mockRatingCondition('sqale_rating');
  expect(
    shallow(<QualityGateCondition component={{ key: 'abcd-key' }} condition={condition} />)
  ).toMatchSnapshot();
});

it('new_reliability_rating', () => {
  const condition = mockRatingCondition('new_reliability_rating');
  condition.period = 1;
  condition.measure.periods = periods;
  expect(
    shallow(<QualityGateCondition component={{ key: 'abcd-key' }} condition={condition} />)
  ).toMatchSnapshot();
});

it('new_security_rating', () => {
  const condition = mockRatingCondition('new_security_rating');
  condition.period = 1;
  condition.measure.periods = periods;
  expect(
    shallow(<QualityGateCondition component={{ key: 'abcd-key' }} condition={condition} />)
  ).toMatchSnapshot();
});

it('new_maintainability_rating', () => {
  const condition = mockRatingCondition('new_maintainability_rating');
  condition.period = 1;
  condition.measure.periods = periods;
  expect(
    shallow(<QualityGateCondition component={{ key: 'abcd-key' }} condition={condition} />)
  ).toMatchSnapshot();
});

it('should work with branch', () => {
  const condition = mockRatingCondition('new_maintainability_rating');
  expect(
    shallow(
      <QualityGateCondition
        branchLike={{ isMain: false, name: 'feature' }}
        component={{ key: 'abcd-key' }}
        condition={condition}
      />
    )
  ).toMatchSnapshot();
});
