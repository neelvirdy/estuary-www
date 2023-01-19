import * as U from '@common/utilities';
import tstyles from '@pages/files-table.module.scss';
import React, { useMemo, useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import PinStatusIcon from './PinStatusIcon';

const FilesTable = ({ files }) => {
  const [gateway, setGateway] = useState('https://gateway.estuary.tech/gw/ipfs/');
  const columns = useMemo(
    () => [
      {
        id: 'Id',
        Header: 'id',
        accessor: (data) => {
          const idFormatted = String(data.id).padStart(9, '0');
          const contentLink = '/content/' + data.id;
          return {
            idFormatted,
            contentLink,
          };
        },
        Cell: ({ value }) => (
          <a href={value.contentLink} style={{ fontFamily: 'Mono', opacity: 0.4 }} target="_blank" className={tstyles.cta}>
            {value.idFormatted}
          </a>
        ),
        disableFilters: true,
        width: '7.8em',
      },
      {
        id: 'Name',
        Header: 'Name',
        accessor: (data) => {
          const cid = data.cid != null ? data.cid['/'] || data.cid : null;
          let name = '';
          if (data.name === 'aggregate') {
            name = './';
          } else if (data.name) {
            name = data.name;
          } else {
            name = data.filename;
          }
          if (!name) {
            name = cid;
          }

          const lk = cid != null ? gateway + cid : null;
          const pinStatus = data.pinningStatus;
          return { name, lk, pinStatus };
        },
        Cell: ({ value }) => (
          <div style={{ display: 'block' }}>
            <PinStatusIcon pinningStatus={value.pinStatus} />
            <a href={value.lk} style={{ overflowWrap: 'break-word' }} target="_blank" className={tstyles.cta}>
              {value.name}
            </a>
          </div>
        ),
        width: '45%',
        Filter: DefaultColumnFilter,
      },
      {
        id: 'Size',
        Header: 'Size',
        accessor: (data) => {
          return U.bytesToSize(data.size);
        },
        width: '7em',
        Filter: DefaultColumnFilter,
      },
      {
        id: 'Created At',
        Header: 'Created At',
        accessor: (data) => {
          return U.toDate(data.createdAt);
        },
        width: '30%',
        Filter: DefaultColumnFilter,
      },
    ],
    [gateway]
  );

  const tableInstance = useTable({ columns, data: files, initialState: { pageIndex: 0, pageSize: 10 } }, useFilters, useSortBy, usePagination);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
    const count = preFilteredRows.length;

    return (
      <input
        className={tstyles.filter}
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  }
  return (
    <React.Fragment>
      <div className={tstyles.gateway}>
        <label>Gateway:</label>
        <select className={tstyles.gatewayInput} value={gateway} onChange={(e) => setGateway(e.target.value)}>
          <option value="https://api.estuary.tech/gw/ipfs/">Estuary.tech</option>
          <option value="https://dweb.link/ipfs/">Dweb</option>
          <option value="https://strn.pl/ipfs/">Saturn</option>
        </select>
      </div>
      <table className={tstyles.table} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr className={tstyles.tr} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className={tstyles.th}
                  {...column.getHeaderProps([
                    {
                      style: {
                        width: column.width,
                      },
                    },
                  ])}
                >
                  <div className={tstyles.hContainer}>
                    <div className={tstyles.hInnerContainer}>
                      <div className={tstyles.hTitle}>
                        <div>{column.render('Header')}</div> <div>{column.canFilter ? column.render('Filter') : null}</div>
                      </div>
                      <div {...column.getSortByToggleProps()}>
                        <div className={tstyles.sortIcon}>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <div>
                                <div>▲</div>
                                <div>▽</div>
                              </div>
                            ) : (
                              <div>
                                <div>△</div>
                                <div>▼</div>
                              </div>
                            )
                          ) : (
                            <div>
                              <div>▲</div>
                              <div>▼</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={tstyles.tbody} {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr className={tstyles.tr} {...row.getRowProps([{ style: {} }])}>
                {row.cells.map((cell) => {
                  return <td className={tstyles.td}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination" style={{ fontSize: '1em', fontFamily: 'Mono', padding: '0.5rem' }}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '2rem', outline: 'none', padding: '0.2rem', fontFamily: 'Mono', fontSize: 10 }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ outline: 'none', padding: '0.2rem', fontFamily: 'Mono', fontSize: 10 }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </React.Fragment>
  );
};

export default FilesTable;
