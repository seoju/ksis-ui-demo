/**
 * biz.file.js - 파일 업로드 관련 유틸리티
 * Author: Developed based on requirements
 * Copyright 2025 Vertexid
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function(utils) {
	// 파일 관련 유틸리티 네임스페이스 생성
	utils.file = utils.file || {};

	// 파일 저장소 - 각 영역별로 파일 정보를 담을 객체
	const _fileStorage = {};
	// 삭제할 파일 목록 저장
	const _deleteFileList = [];

	// 파일 업로드 URL
	const UPLOAD_URL = utils.getUrl('/paragon/file/upload');

	// 파일 크기 제한 (기본 10MB)
	const MAX_FILE_SIZE = 10 * 1024 * 1024;

	// 허용된 파일 확장자 (기본값)
	const ALLOWED_EXTENSIONS = [
		'jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx',
		'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'hwp'
	];

	/**
	 * 파일명을 HTML 에 넣기 전에 이스케이프한다 (2026-10-15 보안점검 H-7).
	 * 업로드한 원본 파일명이 그대로 DB(file_nm)에 저장되고 목록 · 결재문서 모달에 다시 나오므로
	 * <img src=x onerror=…> 같은 이름이 스크립트로 실행되지 않게 한다. biz.string 로드 순서와 무관하게 자체 구현.
	 */
	function escHtml(value) {
		return String(value === null || value === undefined ? '' : value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	// 파일 크기 포맷팅 함수
	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	// 파일 확장자 추출 함수
	function getFileExtension(filename) {
		return filename.split('.').pop().toLowerCase();
	}

	// 파일 확장자 검증 함수
	function isValidFileExtension(filename, allowedExtensions) {
		const ext = getFileExtension(filename);
		return allowedExtensions.includes(ext);
	}

	/**
	 * 수정- data-file-ext="pdf" / "pdf,jpg" 처럼 영역별 허용 확장자를 읽는다 (없으면 null)
	 */
	function parseExtAttr(value) {
		if (!value) return null;
		const list = String(value).split(',')
			.map(v => v.trim().replace(/^\./, '').toLowerCase())
			.filter(v => v.length > 0);
		return list.length > 0 ? list : null;
	}

	// 이미지 미리보기 대상 확장자
	function isPreviewImage(filename) {
		return ['jpg', 'jpeg', 'png', 'gif'].includes(getFileExtension(filename || ''));
	}

	// 파일 아이콘 선택 함수
	function getFileIcon(filename) {
		const ext = getFileExtension(filename);

		const iconMap = {
			'pdf': 'fa-file-pdf',
			'doc': 'fa-file-word', 'docx': 'fa-file-word',
			'xls': 'fa-file-excel', 'xlsx': 'fa-file-excel',
			'ppt': 'fa-file-powerpoint', 'pptx': 'fa-file-powerpoint',
			'jpg': 'fa-file-image', 'jpeg': 'fa-file-image', 'png': 'fa-file-image', 'gif': 'fa-file-image',
			'zip': 'fa-file-archive', 'rar': 'fa-file-archive',
			'txt': 'fa-file-alt',
			'hwp': 'fa-file-alt'
		};

		return iconMap[ext] || 'fa-file';
	}

	// 파일 업로드 영역 생성 함수
	utils.file.initUploadArea = function(selector, options = {}) {
		const $areas = $(selector || '.fileArea');

	    if ($areas.length === 0) {
	        console.warn('파일 업로드 영역을 찾을 수 없습니다:', selector);
	        return;
	    }

	    // relId가 있으면 기존 파일 로드
	    if (options.relId) {
	        this.loadFiles(options.relId);
	    }

		$areas.each(function() {
			const $area = $(this);
			// file-tp 속성을 ID로 사용
			const fileType = $area.data('file-tp');
			const areaId = fileType;

			// file-tp 속성이 없는 경우 처리
			if (!areaId) {
				console.error('파일 업로드 영역에 file-tp 속성이 없습니다.');
				return;
			}

			// 이미 초기화되었는지 확인
			if ($area.data('initialized')) {
				return;
			}

			// 영역별 옵션 설정
			const areaOptions = {
				fileType: fileType || options.fileType || 'DEFAULT',
				maxFileSize: options.maxFileSize || MAX_FILE_SIZE,
				// 수정- 영역에 data-file-ext 가 있으면(예: "pdf") 화면 공통 설정보다 우선한다
				allowedExtensions: parseExtAttr($area.data('file-ext'))
					|| options.allowedExtensions || ALLOWED_EXTENSIONS,
				maxFiles: options.maxFiles || 5,
				multiple: options.multiple !== undefined ? options.multiple : true,
				showImagePreview: options.showImagePreview || false  // [수정] 이미지 미리보기 옵션 추가 (기본값 false)
			};

			// 파일 저장소 초기화 (기존 파일 유지)
			if (!_fileStorage[areaId]) {
				_fileStorage[areaId] = [];
			}

			// HTML 구조 생성
			const uploadAreaHtml = `
			            <div class="file-upload-container">
			                <div class="file-upload-dropzone">
			                    <i class="fas fa-cloud-upload-alt"></i>
			                    <p>파일을 여기에 끌어다 놓거나 선택하세요.</p>
			                    <button type="button" class="btn btn-select-file">파일 선택</button>
			                    <input type="file" class="file-input" style="display:none" accept="${areaOptions.allowedExtensions.map(e => '.' + e).join(',')}" ${areaOptions.multiple ? 'multiple' : ''}>
			                </div>
			                <div class="file-list-container">
			                    <ul class="file-list"></ul>
			                </div>
			            </div>
			        `;

			$area.html(uploadAreaHtml);

			// DOM 요소 참조
			const $container = $area.find('.file-upload-container');
			const $dropzone = $area.find('.file-upload-dropzone');
			const $fileInput = $area.find('.file-input');
			const $fileList = $area.find('.file-list');
			const $selectButton = $area.find('.btn-select-file');

			// 드래그 앤 드롭 이벤트 처리
			// [수정 2026-10-01] 왼쪽 드롭 영역만이 아니라 박스 전체(오른쪽 파일 목록 칸 포함)에 놓을 수 있게 한다.
			//   강조 표시는 예전처럼 왼쪽 영역(.file-upload-dropzone.dragover)에 붙여 기존 CSS 를 그대로 쓴다.
			//   박스 안의 목록·버튼 위를 지날 때마다 dragenter/dragleave 가 번갈아 생기므로
			//   들어온 횟수를 세어 박스를 완전히 벗어났을 때만 강조를 끈다(깜빡임 방지).
			let dragDepth = 0;

			$container.on('dragenter', function(e) {
				e.preventDefault();
				e.stopPropagation();
				dragDepth++;
				$dropzone.addClass('dragover');
			});

			$container.on('dragover', function(e) {
				e.preventDefault();
				e.stopPropagation();
				$dropzone.addClass('dragover');
			});

			$container.on('dragleave', function(e) {
				e.preventDefault();
				e.stopPropagation();
				dragDepth = Math.max(0, dragDepth - 1);
				if (dragDepth === 0) {
					$dropzone.removeClass('dragover');
				}
			});

			$container.on('drop', function(e) {
				e.preventDefault();
				e.stopPropagation();
				dragDepth = 0;
				$dropzone.removeClass('dragover');

				const files = e.originalEvent.dataTransfer.files;
				processFiles(files, areaId, areaOptions, $fileList);
			});

			// 파일 선택 버튼 클릭 이벤트
			$selectButton.on('click', function() {
				$fileInput.click();
			});

			// 파일 입력 변경 이벤트
			$fileInput.on('change', function() {
				const files = this.files;
				processFiles(files, areaId, areaOptions, $fileList);
				// 파일 선택 후 input 초기화 (동일 파일 선택 가능하도록)
				$(this).val('');
			});

			// [수정] areaOptions를 data에 저장 (displayLoadedFiles에서 참조하기 위해)
			$area.data('areaOptions', areaOptions);

			// 초기화 완료 표시
			$area.data('initialized', true);
		});
	};

	// 파일 처리 함수
	function processFiles(files, areaId, options, $fileList) {
		if (!files || files.length === 0) return;

		// 현재 저장된 파일 개수 확인
		const currentFileCount = _fileStorage[areaId].length;

		// 파일 개수 제한 확인
		if (currentFileCount + files.length > options.maxFiles) {
			utils.showAlert(`최대 ${options.maxFiles}개의 파일만 업로드할 수 있습니다.`);
			return;
		}

		// 파일 처리
		Array.from(files).forEach(file => {
			// 파일 크기 검증
			if (file.size > options.maxFileSize) {
				utils.showAlert(`파일 크기가 너무 큽니다: ${escHtml(file.name)} (${formatFileSize(file.size)}). 최대 ${formatFileSize(options.maxFileSize)}까지 허용됩니다.`);
				return;
			}

			// 파일 확장자 검증
			if (!isValidFileExtension(file.name, options.allowedExtensions)) {
				utils.showAlert(`허용되지 않는 파일 형식입니다: ${escHtml(file.name)}`);
				return;
			}

			// 파일 고유 ID 생성
			const fileId = 'file_' + new Date().getTime() + '_' + Math.random().toString(36).substring(2, 15);

			// 파일 정보 객체 생성
			const fileInfo = {
				id: fileId,
				file: file,
				name: file.name,
				size: file.size,
				type: file.type,
				lastModified: file.lastModified,
				fileType: options.fileType
			};

			// 파일 저장소에 추가
			_fileStorage[areaId].push(fileInfo);

			console.log(`파일 추가됨 (${areaId}):`, fileInfo);
			console.log(`현재 저장소 상태:`, _fileStorage);

			// 파일 목록에 표시
			addFileToList(fileInfo, areaId, $fileList, options);  // [수정] options 전달
		});
	}

	// 파일 목록에 추가 함수
	function addFileToList(fileInfo, areaId, $fileList, options) {  // [수정] options 파라미터 추가
		const fileIcon = getFileIcon(fileInfo.name);
		const fileSize = formatFileSize(fileInfo.size);

		// [수정] showImagePreview가 true이고 이미지 파일이면 썸네일 표시, 기본값은 아이콘
		const showImagePreview = options && options.showImagePreview && isPreviewImage(fileInfo.name);

		const thumbHtml = showImagePreview
		    ? `<div class="file-thumb"><img src="" alt="미리보기" class="file-thumb-img" style="max-width:200px;max-height:80px;width:auto;height:auto;object-fit:contain;border-radius:4px;"></div>`
		    : `<div class="file-icon"><i class="fas ${fileIcon}"></i></div>`;

		const $fileItem = $(`
            <li class="file-item" data-file-id="${fileInfo.id}">
                ${thumbHtml}
                <div class="file-info">
                    <div class="file-name">${escHtml(fileInfo.name)}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
                <div class="file-actions">
                    <button type="button" class="btn-remove-file" title="파일 제거">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </li>
        `);

		// [수정] 이미지 파일이면 FileReader로 썸네일 로드
		if (showImagePreview && fileInfo.file) {
			const reader = new FileReader();
			reader.onload = function(e) {
				$fileItem.find('.file-thumb-img').attr('src', e.target.result);
			};
			reader.readAsDataURL(fileInfo.file);
		}

		// 파일 제거 버튼 이벤트
		$fileItem.find('.btn-remove-file').on('click', function() {
			removeFile(fileInfo.id, areaId);
			$fileItem.fadeOut(300, function() {
				$(this).remove();
			});
		});

		$fileList.append($fileItem);
	}

	// 파일 제거 함수
	function removeFile(fileId, areaId) {
		const index = _fileStorage[areaId].findIndex(item => item.id === fileId);
		if (index !== -1) {
			_fileStorage[areaId].splice(index, 1);
		}
	}

	// 파일 업로드 실행 함수 - relId 파라미터 추가
	utils.file.uploadFiles = function(relId, callback) {
	    // 콜백이 두 번째 파라미터로 전달되지 않은 경우 처리
	    if (typeof relId === 'function' && callback === undefined) {
	        callback = relId;
	        relId = '';
	    }

	    // 파일이 있는지 확인 (새로 추가된 파일만)
	    let hasNewFiles = false;
	    for (const areaId in _fileStorage) {
	        const newFiles = _fileStorage[areaId].filter(f => !f.isDatabase);
	        if (newFiles && newFiles.length > 0) {
	            hasNewFiles = true;
	            break;
	        }
	    }

	    // 삭제할 파일이 있는지 확인
	    const hasFilesToDelete = _deleteFileList && _deleteFileList.length > 0;

	    // 파일 변경사항이 없으면 콜백 바로 실행
	    if (!hasNewFiles && !hasFilesToDelete) {
	        if (typeof callback === 'function') {
	            callback({success: true, message: '변경된 파일이 없습니다'});
	        }
	        return false;
	    }

	    // FormData 생성
	    const formData = new FormData();

	    // relId 추가
	    formData.append('relId', relId || '');

	    // 삭제할 파일 목록 추가
	    if (hasFilesToDelete) {
	        formData.append('deleteFiles', JSON.stringify(_deleteFileList));
	    }

	    // 업로드할 파일 정보 구성
	    const fileInfos = [];

	    // 모든 영역의 파일 처리 (DB에서 불러온 파일 제외)
	    if (hasNewFiles) {
	        for (const areaId in _fileStorage) {
	            const files = _fileStorage[areaId];
	            const newFiles = files.filter(f => !f.isDatabase);

	            for (let i = 0; i < newFiles.length; i++) {
	                const fileInfo = newFiles[i];

	                // 파일 정보 추가
	                fileInfos.push({
	                    id: fileInfo.id,
	                    name: fileInfo.name,
	                    size: fileInfo.size,
	                    fileType: fileInfo.fileType,
	                    areaId: areaId
	                });

	                // FormData에 파일 추가
	                formData.append('files', fileInfo.file);
	            }
	        }

	        // 파일 정보를 JSON 문자열로 변환하여 FormData에 추가
	        formData.append('fileInfos', JSON.stringify(fileInfos));
	    }

	    // AJAX 요청 설정
	    $.ajax({
	        url: UPLOAD_URL,
	        type: 'POST',
	        data: formData,
	        processData: false,
	        contentType: false,
	        success: function(response) {
	            // 업로드 성공 후 파일 저장소 초기화
	            for (const areaId in _fileStorage) {
	                _fileStorage[areaId] = [];
	                $(`[data-file-tp="${areaId}"]`).find('.file-list').empty();
	            }

	            // 삭제 목록 초기화
	            _deleteFileList.length = 0;

	            if (typeof callback === 'function') {
	                callback({
	                    success: true,
	                    data: response
	                });
	            }
	        },
	        error: function(xhr, status, error) {
	            console.error('파일 처리 중 오류 발생:', error);

	            if (typeof callback === 'function') {
	                callback({
	                    success: false,
	                    message: '파일 처리 중 오류가 발생했습니다.',
	                    error: error
	                });
	            }
	        }
	    });

	    return true;
	};

	// 파일 존재 여부 확인 함수
	utils.file.hasFiles = function(areaId) {
		// 수정- 기존 파일 삭제만 있는 경우에도 저장 대상으로 판단 (삭제 목록 전송 누락 방지)
		if (_deleteFileList && _deleteFileList.length > 0) {
			return true;
		}

		if (areaId) {
			return _fileStorage[areaId] && _fileStorage[areaId].length > 0;
		} else {
			// 모든 영역에 대해 파일 존재 여부 확인
			for (const id in _fileStorage) {
				if (_fileStorage[id] && _fileStorage[id].length > 0) {
					return true;
				}
			}
			return false;
		}
	};

	// 파일 정보 가져오기 함수
	utils.file.getFiles = function(areaId) {
		if (areaId) {
			return _fileStorage[areaId] || [];
		} else {
			// 모든 영역의 파일 정보 반환
			return _fileStorage;
		}
	};

	// 파일 목록 초기화 함수
	utils.file.clearFiles = function(areaId) {
		if (areaId) {
			_fileStorage[areaId] = [];
			// ID 기반 선택자 제거 → data-file-tp 기준으로 선택
			$(`.fileArea[data-file-tp="${areaId}"]`).find('.file-list').empty();
		} else {
			// 모든 영역의 파일 목록 초기화
			for (const id in _fileStorage) {
				_fileStorage[id] = [];
				$(`.fileArea[data-file-tp="${id}"]`).find('.file-list').empty();
			}
		}
	};

	/**
	 * 업로드 대기 파일과 삭제 예정 목록을 모두 비운다.
	 * 둘 다 페이지 전체에 하나뿐이라, 모달을 열 때마다 부르지 않으면 지난번 모달에서
	 * 고른 파일이 같이 올라가거나 지운다고 표시한 파일이 다른 문서 저장 때 지워진다.
	 * (clearFiles 는 삭제 예정 목록을 비우지 않는다)
	 */
	utils.file.reset = function() {
		utils.file.clearFiles();
		_deleteFileList.length = 0;
	};

	// 파일 목록 로드 함수
	utils.file.loadFiles = function(relId, callback) {
		if (!relId) {
			console.warn('relId가 제공되지 않았습니다.');
			return;
		}

		// 파일 조회 URL
		const fileListUrl = utils.getUrl('/paragon/file/list');

		// AJAX 요청
		$.ajax({
			url: fileListUrl,
			type: 'GET',
			data: { relId: relId },
			success: function(response) {
				if (response.success) {
					// 받아온 파일 정보를 각 영역에 표시
					displayLoadedFiles(response.data);

					if (typeof callback === 'function') {
						callback({
							success: true,
							data: response.data
						});
					}
				} else {
					console.warn('파일 목록 조회 실패:', response.message);

					if (typeof callback === 'function') {
						callback({
							success: false,
							message: response.message
						});
					}
				}
			},
			error: function(xhr, status, error) {
				console.error('파일 목록 조회 중 오류 발생:', error);

				if (typeof callback === 'function') {
					callback({
						success: false,
						message: '파일 목록 조회 중 오류가 발생했습니다.',
						error: error
					});
				}
			}
		});
	};

	// 로드된 파일 표시 함수
	function displayLoadedFiles(files) {
		if (!files || !Array.isArray(files) || files.length === 0) {
			return;
		}

		// 파일 타입별로 분류
		const filesByType = {};

		files.forEach(file => {
			const fileType = file.fileTpCd; // DB에서 가져온 파일 타입 코드

			if (!filesByType[fileType]) {
				filesByType[fileType] = [];
			}

			filesByType[fileType].push(file);
		});

		// 각 파일 타입별로 파일 목록에 추가
		for (const fileType in filesByType) {
			const $area = $(`.fileArea[data-file-tp="${fileType}"]`);
			const $fileList = $area.find('.file-list');
			const areaOptions = $area.data('areaOptions') || {};  // [수정] 저장된 options 참조

			// 현재 저장소에 파일 추가
			filesByType[fileType].forEach(file => {
				// 파일 고유 ID 생성
//				const fileId = 'file_db_' + file.ordNo;
				// 파일 고유 ID 생성
				const fileId = 'file_db_' + new Date().getTime() + '_' + Math.random().toString(36).substring(2, 15);


				// 파일 정보 객체 생성 (DB에서 가져온 정보 기반)
				const fileInfo = {
					id: fileId,
					name: file.fileNm,
					size: file.fileSize,
					type: file.fileTp,
					fileType: fileType,
					fileId: file.fileId,
					isDatabase: true // DB에서 로드된 파일 표시
				};

				// 파일 저장소에 추가
				if (!_fileStorage[fileType]) {
					_fileStorage[fileType] = [];
				}
				_fileStorage[fileType].push(fileInfo);

				// 파일 목록에 표시
				addLoadedFileToList(fileInfo, fileType, $fileList, areaOptions);  // [수정] areaOptions 전달
			});
		}
	}

	// DB에서 로드된 파일을 목록에 추가하는 함수
	function addLoadedFileToList(fileInfo, fileType, $fileList, options) {  // [수정] options 파라미터 추가
		const fileIcon = getFileIcon(fileInfo.name);
		const fileSize = formatFileSize(fileInfo.size);

		// [수정] showImagePreview가 true이고 이미지 파일이면 썸네일 표시, 기본값은 아이콘
		const showImagePreview = options && options.showImagePreview && isPreviewImage(fileInfo.name);

		const thumbHtml = showImagePreview
		    ? `<div class="file-thumb"><img src="${utils.getUrl('/paragon/file/showimg')}/${fileInfo.fileId}" alt="미리보기" class="file-thumb-img" style="max-width:200px;max-height:80px;width:auto;height:auto;object-fit:contain;border-radius:4px;"></div>`
		    : `<div class="file-icon"><i class="fas ${fileIcon}"></i></div>`;

		const $fileItem = $(`
	        <li class="file-item loaded-file" data-file-id="${fileInfo.id}" data-file-seq="${fileInfo.fileId}">
	            ${thumbHtml}
	            <div class="file-info">
	                <div class="file-name">${escHtml(fileInfo.name)}</div>
	                <div class="file-size">${fileSize}</div>
	            </div>
	            <div class="file-actions">
	                <button type="button" class="btn-download-file" title="파일 다운로드">
	                    <i class="fas fa-download"></i>
	                </button>
	                <button type="button" class="btn-remove-file" title="파일 제거">
	                    <i class="fas fa-times"></i>
	                </button>
	            </div>
	        </li>
	    `);

		// 파일 다운로드 버튼 이벤트
		$fileItem.find('.btn-download-file').on('click', function() {
			const fileSeq = $(this).closest('.file-item').data('file-seq');
			downloadFile(fileSeq);
		});

		// 파일 제거 버튼 이벤트
		$fileItem.find('.btn-remove-file').on('click', function() {
			const $item = $(this).closest('.file-item');
			const fileId = $item.data('file-id');
			const fileSeq = $item.data('file-seq');

			// 사용자에게 제거 여부 확인
			utils.showConfirm('파일을 목록에서 제거하시겠습니까?', function() {
				// 저장소에서 제거
				removeFile(fileId, fileType);

				// 화면에서 제거
				$item.fadeOut(300, function() {
					$(this).remove();
				});

				// 삭제할 파일 목록에 추가 (저장 시 함께 처리)
				if (!_deleteFileList) {
					_deleteFileList = [];
				}
				_deleteFileList.push(fileSeq);
			});
		});

		$fileList.append($fileItem);
	}

	// 파일 다운로드 함수
	function downloadFile(fileId) {
		if (!fileId) return;

		const downloadUrl = utils.getUrl('/paragon/file/download');

		// 새 창으로 다운로드 링크 열기
		window.open(`${downloadUrl}/${fileId}`, '_blank');
	}


	// 파일 뷰 영역 초기화 함수
	    utils.file.initFileView = function(selector, options = {}) {
	        const $areas = $(selector || '.fileArea');

	        if ($areas.length === 0) {
	            console.warn('파일 뷰 영역을 찾을 수 없습니다:', selector);
	            return;
	        }

	        $areas.each(function() {
	            const $area = $(this);
	            const fileType = $area.data('file-tp');

	            // 이미 초기화되었는지 확인
	            if ($area.data('view-initialized')) {
	                return;
	            }

	            // HTML 구조 생성 (뷰 모드용)
	            const fileViewHtml = `
	                <div class="file-view-container">
	                    <div class="file-list-header">
	                        <div class="file-header-title">첨부파일</div>
	                        <div class="file-counter"></div>
	                    </div>
	                    <div class="file-view-list-container">
	                        <ul class="file-view-list"></ul>
	                    </div>
	                </div>
	            `;

	            $area.html(fileViewHtml);

	            // relId가 있으면 파일 로드
	            if (options.relId) {
	                loadFilesForView(options.relId, fileType, $area, options);  // [수정] options 전달
	            }

	            // 초기화 완료 표시
	            $area.data('view-initialized', true);
	        });
	    };

	    // 뷰 모드용 파일 로드 함수
	    function loadFilesForView(relId, fileType, $area, options) {  // [수정] options 파라미터 추가
	        if (!relId) {
	            console.warn('relId가 제공되지 않았습니다.');
	            return;
	        }

	        // 파일 조회 URL
	        const fileListUrl = utils.getUrl('/paragon/file/list');

	        // AJAX 요청
	        $.ajax({
	            url: fileListUrl,
	            type: 'GET',
	            data: { relId: relId },
	            success: function(response) {
	                if (response.success) {
	                    // 받아온 파일 정보를 뷰 모드로 표시
	                    displayFilesInViewMode(response.data, fileType, $area, options);  // [수정] options 전달
	                } else {
	                    console.warn('파일 목록 조회 실패:', response.message);

	                    // 파일이 없을 경우 메시지 표시
	                    $area.find('.file-view-list').html('<li class="file-empty-message">첨부파일이 없습니다.</li>');
	                }
	            },
	            error: function(xhr, status, error) {
	                console.error('파일 목록 조회 중 오류 발생:', error);
	                // 오류 메시지 표시
	                $area.find('.file-view-list').html('<li class="file-error-message">파일 정보를 불러올 수 없습니다.</li>');
	            }
	        });
	    }

	    // 뷰 모드로 파일 표시 함수
	    function displayFilesInViewMode(files, fileType, $area, options) {  // [수정] options 파라미터 추가
	        if (!files || !Array.isArray(files) || files.length === 0) {
	            // 파일이 없을 경우 메시지 표시
	            $area.find('.file-view-list').html('<li class="file-empty-message">첨부파일이 없습니다.</li>');
	            $area.find('.file-counter').text('(0)');
	            return;
	        }

	        // 파일 타입별로 분류
	        const filesByType = {};
	        let relevantFiles = [];

	        files.forEach(file => {
	            const type = file.fileTpCd; // DB에서 가져온 파일 타입 코드

	            if (!filesByType[type]) {
	                filesByType[type] = [];
	            }

	            filesByType[type].push(file);

	            // 현재 영역과 관련된 파일인 경우 (fileType이 지정되지 않으면 모든 파일 표시)
	            if (!fileType || type === fileType) {
	                relevantFiles.push(file);
	            }
	        });

	        const $fileList = $area.find('.file-view-list');
	        $fileList.empty();

	        // 파일 수 표시
	        $area.find('.file-counter').text(`(${relevantFiles.length})`);

	        // 수정- 다른 유형 첨부만 있어 이 영역이 0건일 때도 안내 문구를 표시
	        if (relevantFiles.length === 0) {
	            $fileList.html('<li class="file-empty-message">첨부파일이 없습니다.</li>');
	            return;
	        }

	        // 관련 파일 표시
	        relevantFiles.forEach(file => {
	            // 파일 아이콘 결정
	            const fileIcon = getFileIcon(file.fileNm);
	            const fileSize = formatFileSize(file.fileSize);

	            // [수정] showImagePreview가 true이고 이미지 파일이면 썸네일 표시, 기본값은 아이콘
	            const showImagePreview = options && options.showImagePreview && isPreviewImage(file.fileNm);

	            const thumbHtml = showImagePreview
	                ? `<div class="file-view-thumb"><img src="${utils.getUrl('/paragon/file/showimg')}/${file.fileId}" alt="미리보기" style="width:225px;height:60px;object-fit:cover;border-radius:4px;"></div>`
	                : `<div class="file-view-icon"><i class="fas ${fileIcon}"></i></div>`;

	            // 파일 항목 생성
	            const $fileItem = $(`
	                <li class="file-view-item" data-file-id="${file.fileId}">
	                    ${thumbHtml}
	                    <div class="file-view-info">
	                        <div class="file-view-name">${escHtml(file.fileNm)}</div>
	                        <div class="file-view-size">${fileSize}</div>
	                    </div>
	                    <div class="file-view-actions">
	                        <button type="button" class="btn-view-download" title="파일 다운로드">
	                            <i class="fas fa-download"></i>
	                        </button>
	                    </div>
	                </li>
	            `);

	            // 다운로드 버튼 이벤트
	            $fileItem.find('.btn-view-download').on('click', function() {
	                const fileId = $(this).closest('.file-view-item').data('file-id');
	                downloadFile(fileId);
	            });

	            $fileList.append($fileItem);
	        });
	    }

})(window.biz = window.biz || {});