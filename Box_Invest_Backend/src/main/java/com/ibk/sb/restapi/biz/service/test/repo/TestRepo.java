package com.ibk.sb.restapi.biz.service.test.repo;

import com.ibk.sb.restapi.biz.service.test.vo.RequestTestPagingVO;
import com.ibk.sb.restapi.biz.service.test.vo.TestConnectDualVO;
import com.ibk.sb.restapi.biz.service.test.vo.TestDataVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TestRepo {
    public TestConnectDualVO testConnectDual();

    public List<TestDataVO> testPaging(RequestTestPagingVO requestTestPagingVO);

//    public Integer testInsertQnaTx(QnaVO qaVO);

//    public Integer testInsert
}
