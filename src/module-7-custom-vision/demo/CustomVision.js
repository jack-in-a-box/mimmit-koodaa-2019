import React from 'react';
import './CustomVision.css';
import { FileListUri, CustomVisionUri } from '../../general/constants';
import PropTypes from 'prop-types';

const FileList = ({ categorizeImage }) => {
    const [fileURIs, setFileURIs] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        fileDownload();
    }, []);

    const fileDownload = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(FileListUri);
            const URIs = await res.json();
            setFileURIs(URIs);
        } finally {
            setIsLoading(false);
        }
    };

    const fileNameFromURI = fileURI => fileURI.split('/')[fileURI.split('/').length - 1];
    const rowKey = (URI, index) => String.prototype.concat.apply('file_', [fileNameFromURI(URI), index]);
    return (
        <>
            <h1>Images</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Image</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {fileURIs.map((fileURI, index) => (
                            <tr key={rowKey(fileURI, index)}>
                                <td>{fileNameFromURI(fileURI)}</td>
                                <td>
                                    <button onClick={categorizeImage.bind(null, fileURI)}>Analyze image</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

FileList.propTypes = {
    categorizeImage: PropTypes.func.isRequired
};

const ImageCategories = ({ categoryTags, analyzeInProgress }) => {
    return (
        <>
            <h2>Image tags</h2>
            {categoryTags.length > 0 && (
                <textarea
                    readOnly
                    rows={30}
                    style={{ width: '40rem' }}
                    value={JSON.stringify(categoryTags, null, 2)}
                ></textarea>
            )}
            {analyzeInProgress && <p>Analyzing image...</p>}
        </>
    );
};

ImageCategories.propTypes = {
    categoryTags: PropTypes.array.isRequired,
    analyzeInProgress: PropTypes.bool.isRequired
};

const CustomVision = () => {
    const [categoryTags, setCategoryTags] = React.useState([]);
    const [analyzeInProgress, setAnalyzeInProgress] = React.useState(false);

    const categorizeImage = async blobUri => {
        setAnalyzeInProgress(true);
        setCategoryTags([]);
        try {
            const response = await fetch(`${CustomVisionUri}?url=${blobUri}`);
            if (response.ok) {
                const tags = await response.json();
                setCategoryTags(tags);
            } else {
                alert(response.statusText);
            }
        } finally {
            setAnalyzeInProgress(false);
        }
    };

    return (
        <div className="CustomVision">
            <FileList categorizeImage={categorizeImage} />
            <ImageCategories categoryTags={categoryTags} analyzeInProgress={analyzeInProgress} />
        </div>
    );
};

export default CustomVision;
