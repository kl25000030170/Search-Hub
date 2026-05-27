package com.searchfilter.platform.repository;

import com.searchfilter.platform.entity.SearchLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchLogRepository extends JpaRepository<SearchLog, Long> {
    List<SearchLog> findAllByOrderByTimestampDesc();
}
